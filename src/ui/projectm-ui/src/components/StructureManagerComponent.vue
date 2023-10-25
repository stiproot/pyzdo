<template>
  <div
    v-if="!editing && !structuring"
    class="qa-pa-md row items-start q-gutter-md"
  >
    <ItemSelectorComponent :items="enriched" @item-click="handleItemClick" />
  </div>

  <StructureComponent v-if="editing && !structuring"></StructureComponent>

  <ProcessOrchestratorComponent
    v-if="structuring && !editing"
    :blueprints="blueprints"
    @processes-complete="handleStructureProcessesComplete"
  />

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
import { ref, reactive, toRefs, onMounted } from "vue";
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
import ProcessOrchestratorComponent from "./ProcessOrchestratorComponent.vue";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { generateGuid } from "@/services/guids.service";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import { structure } from "@/services/structures.service";

export default {
  name: "StructureManagerComponent",
  components: {
    ItemSelectorComponent,
    FabActionComponent,
    BtnComponent,
    StructureComponent,
    ProcessOrchestratorComponent,
  },
  setup() {
    const router = useRouter();
    const nav = new NavigationService(router);
    const loadingStore = useLoadingStore();
    const loadingProvider = new LoadingProvider(loadingStore);
    const structuresStore = useStructuresStore();
    const structuresProvider = new StructuresProvider(structuresStore);
    const structureStagingStore = useStructureStagingStore();
    const structureStagingProvider = new StructureStagingProvider(
      structureStagingStore
    );

    const editing = ref(false);
    const structuring = ref(false);
    const blueprints = ref([]);
    const CMD_TYPE_HASH = {
      summarized_tree: CMD_TYPES.BUILD_SUMMARIZED_WORK_ITEM_TREE,
      weighted_tree: CMD_TYPES.BUILD_WEIGHTED_WORK_ITEM_TREE,
    };

    const { isLoading } = loadingProvider;
    const { enrichedStructures, structures } = structuresProvider;
    const data = reactive({
      isLoading,
      structures,
      enriched: enrichedStructures,
      blueprints,
      structuring,
    });

    const handleItemClick = (e) => {
      editing.value = true;
      const item = enrichedStructures.value.find((i) => i.id === e);
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
            project_id: nav.projId,
            status: PROCESS_STATUSES.RUNNING,
            cmd_type: CMD_TYPE_HASH[i.id],
          };
        });

        console.log("handleStructureAllClick", "procs", procs);

        structuring.value = true;
        editing.value = false;
        blueprints.value = procs;

        await Promise.all(
          procs.map((proc) => {
            structure({
              idempotencyId: proc.id,
              projectId: proc.project_id,
              cmdType: proc.cmd_type,
              rootCollection: "epics",
            });
          })
        );
      } catch (ex) {
        console.log(ex);
      }
    };

    const handleStructureProcessesComplete = () => {
      blueprints.value = [];
      structuring.value = false;
    };

    onMounted(() => {});

    return {
      ...toRefs(data),
      editing,
      handleItemClick,
      handleCloseClick,
      handleStructureAllClick,
      handleStructureProcessesComplete,
    };
  },
};
</script>
<style></style>
