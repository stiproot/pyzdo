<template>
  <div v-if="!editing" class="qa-pa-md row items-start q-gutter-md">
    <ItemSelectorComponent
      :items="enrichedQueries"
      @item-click="handleItemClick"
      @delete-click="handleDeleteClick"
    />
  </div>
  <QueryComponent v-if="editing"> </QueryComponent>
  <FabActionComponent>
    <BtnComponent
      icon="add"
      v-if="!editing && !gathering"
      @click="handleAddClick"
    />
    <BtnComponent
      v-if="editing && enrichedQueries.length && !gathering"
      @click="handleCloseClick"
    />
    <BtnComponent
      icon="check"
      v-if="isValid && editing && !gathering"
      @click="handleSaveClick"
    />

    <BtnComponent
      v-if="!editing"
      class="float-right"
      icon="replay"
      @click="handleGatherAllClick"
    />

    <BtnComponent
      v-if="canSave && !gathering"
      icon="check"
      @click="handleSaveClick"
    />
  </FabActionComponent>

  <ProcessOrchestratorComponent
    v-if="gathering"
    :blueprints="blueprints"
    @processes-complete="handleGatheringProcessesComplete"
  />
</template>
<script>
import { ref, computed, reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import { useLoadingStore, LoadingProvider } from "@/stores/loading.store.js";
import {
  useProjectDetailsStore,
  ProjectDetailsProvider,
} from "@/stores/project-details.store";
import { useQueryStore, QueryProvider } from "@/stores/query.store.js";
import { deepCopy } from "@/services/clone.service.js";
import ItemSelectorComponent from "./ItemSelectorComponent.vue";
import FabActionComponent from "./FabActionComponent.vue";
import BtnComponent from "./BtnComponent.vue";
import QueryComponent from "./QueryComponent.vue";
import ProcessOrchestratorComponent from "./ProcessOrchestratorComponent.vue";
import { CMD_TYPES } from "@/services/cmd-types.enum.js";
import { PROCESS_STATUSES } from "@/services/process-statuses.enum";
import { generateGuid } from "@/services/guids.service";
import { gather } from "@/services/gather.service";

export default {
  name: "QueryManagerComponent",
  components: {
    ItemSelectorComponent,
    FabActionComponent,
    BtnComponent,
    QueryComponent,
    ProcessOrchestratorComponent,
  },
  setup() {
    const router = useRouter();
    const nav = new NavigationService(router);
    const loadingStore = useLoadingStore();
    const loadingProvider = new LoadingProvider(loadingStore);
    const projectStore = useProjectDetailsStore();
    const projectProvider = new ProjectDetailsProvider(projectStore);
    const queryStore = useQueryStore();
    const queryProvider = new QueryProvider(queryStore);

    const editing = ref(false);
    const blueprints = ref([]);
    const gathering = ref(false);
    const { isLoading } = loadingProvider;
    const { enrichedQueries, queries, addQuery, removeQuery } = projectProvider;
    const { init, state, isStateValid } = queryProvider;
    const canSave = computed(() => isStateValid.value);

    const data = reactive({
      init,
      canSave,
      isLoading,
      enrichedQueries,
      blueprints,
      editing,
      gathering,
    });

    const handleGatheringProcessesComplete = () => {
      blueprints.value = [];
      gathering.value = false;
    };

    const handleItemClick = (e) => {
      editing.value = true;

      const item = queries.value.find((i) => i.id === e);
      data.init(item);
    };

    const handleDeleteClick = (e) => {
      removeQuery(e);
    };

    const handleAddClick = () => {
      editing.value = true;
      data.init();
    };

    const handleSaveClick = () => {
      data.isLoading = true;
      const query = state.value;
      const existing = queries.value.find((i) => i.id === query.id);

      if (existing) {
        existing.ql = query.ql;
      } else {
        const clone = deepCopy(query);
        addQuery(clone);
      }
      /* await sync(); */
      editing.value = false;
    };

    const handleGatherAllClick = async () => {
      try {
        const procs = queries.value.map((i) => {
          return {
            id: generateGuid(),
            project_id: nav.projId,
            status: PROCESS_STATUSES.RUNNING,
            cmd_type: CMD_TYPES.GATHER_PROJECT_UNITS_OF_WORK,
            ql: i.ql,
          };
        });

        blueprints.value = procs;
        gathering.value = true;

        await Promise.all(
          procs.map((proc) => {
            gather({
              processId: proc.id,
              projectId: proc.project_id,
              ql: proc.ql,
            });
          })
        );
      } catch (ex) {
        console.log(ex);
      }
    };

    const handleCloseClick = () => {
      data.init();
      editing.value = false;
    };

    const initState = () => {
      editing.value = nav.isNewProject();
    };

    onMounted(() => {
      console.log("queryManagerComponent", "onMounted");
      initState();
    });

    return {
      ...toRefs(data),
      handleGatheringProcessesComplete,
      handleGatherAllClick,
      handleItemClick,
      handleAddClick,
      handleDeleteClick,
      handleSaveClick,
      handleCloseClick,
    };
  },
};
</script>
<style></style>
