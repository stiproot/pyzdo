<template>
  <div
    v-if="!editing && !structuring"
    class="qa-pa-md row items-start q-gutter-md"
  >
    <ItemSelectorComponent :items="enriched" @item-click="handleItemClick" />
  </div>

  <StructureComponent v-if="editing && !structuring" />

  <ProcessesComponent v-if="structuring" :blueprints="processes" />

  <FabActionComponent>
    <BtnComponent
      v-if="editing && enriched.length && !structuring"
      @click="handleCloseClick"
    />
    <BtnComponent
      v-if="!editing && !structuring"
      class="float-right"
      icon="replay"
      @click="handleStructureAllClick"
    />
  </FabActionComponent>
</template>

<script>
import { onMounted, ref, reactive, toRefs } from "vue";
import { useLoadingStore, LoadingProvider } from "@/stores/loading.store.js";
import {
  useStructureStagingStore,
  StructureStagingProvider,
} from "@/stores/structure-staging.store";
import {
  useStructuresStore,
  StructuresProvider,
} from "@/stores/structures.store";
import ItemSelectorComponent from "./ItemSelectorComponent.vue";
import FabActionComponent from "./FabActionComponent.vue";
import BtnComponent from "./BtnComponent.vue";
import StructureComponent from "./StructureComponent.vue";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { generateGuid } from "@/services/guids.service";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import { structure } from "@/services/structures.service";
import ProcessesComponent from "./ProcessesComponent.vue";
import { useProcessStore, ProcessProvider } from "@/stores/process.store";

export default {
  name: "StructureManagerComponent",
  components: {
    ItemSelectorComponent,
    FabActionComponent,
    BtnComponent,
    StructureComponent,
    ProcessesComponent,
  },
  setup() {
    const nav = new NavigationService(useRouter());
    const loadingProvider = new LoadingProvider(useLoadingStore());
    const { isLoading } = loadingProvider;
    const structuresProvider = new StructuresProvider(useStructuresStore());
    const { enrichedStructures, structures } = structuresProvider;
    const structureStagingProvider = new StructureStagingProvider(
      useStructureStagingStore()
    );
    const processProvider = new ProcessProvider(useProcessStore());
    const { processes, refresh, syncAll, isStillRunning } = processProvider;

    const editing = ref(false);
    const structuring = ref(false);

    const CMD_TYPE_HASH = {
      summarized_tree: CMD_TYPES.BUILD_SUMMARIZED_WORK_ITEM_TREE,
      weighted_tree: CMD_TYPES.BUILD_WEIGHTED_WORK_ITEM_TREE,
    };

    const data = reactive({
      isLoading,
      structures,
      enriched: enrichedStructures,
      structuring,
      editing,
      processes,
    });

    const handleItemClick = (e) => {
      editing.value = true;
      const item = enrichedStructures.value.find((i) => i.id === e.item.id);
      structureStagingProvider.init(item);
    };

    const handleCloseClick = () => {
      structureStagingProvider.init();
      editing.value = false;
    };

    const handleStructureAllClick = async () => {
      try {
        const procs = structures.value.map((i) => {
          return {
            id: generateGuid(),
            display: i.id,
            project_id: nav.projId,
            status: PROCESS_STATUSES.RUNNING,
            cmd_type: CMD_TYPE_HASH[i.id],
            key: i.id,
          };
        });

        structuring.value = true;
        editing.value = false;
        processes.value = procs;

        await syncAll();

        await Promise.all(
          procs.map((proc) => {
            structure({
              idempotencyId: proc.id,
              projectId: proc.project_id,
              cmdType: proc.cmd_type,
              key: proc.key,
            });
          })
        );

        initProcessInterval();
      } catch (ex) {
        console.error(ex);
      }
    };

    const initProcessInterval = () => {
      let intervalId = setInterval(async () => {
        if (isStillRunning.value) {
          await refresh();
        } else {
          clearInterval(intervalId);
          setTimeout(() => {
            handleStructureProcessesComplete();
          }, 2000);
        }
      }, 3000);
    };

    const handleStructureProcessesComplete = async () => {
      processes.value = [];
      structuring.value = false;
      await structuresProvider.init(nav.projId);
    };

    onMounted(async () => {
      await structuresProvider.init(nav.projId);
    });

    return {
      ...toRefs(data),
      handleItemClick,
      handleCloseClick,
      handleStructureAllClick,
      handleStructureProcessesComplete,
    };
  },
};
</script>
<style></style>
