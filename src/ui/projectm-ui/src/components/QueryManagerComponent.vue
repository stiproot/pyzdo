<template>
  <div
    v-if="!editing && !gathering"
    class="qa-pa-md row items-start q-gutter-md"
  >
    <ItemSelectorComponent
      :items="enrichedQueries"
      @item-click="handleItemClick"
      @delete-click="handleDeleteClick"
    />
  </div>

  <QueryComponent v-if="editing"> </QueryComponent>

  <br />
  <q-btn-group push>
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
      v-if="editing && !gathering"
      @click="handleSaveClick"
    />

    <BtnComponent
      v-if="!gathering && !isModified && !editing"
      class="float-right"
      icon="replay"
      @click="handleGatherAllClick"
    />
  </q-btn-group>

  <ProcessesComponent v-if="gathering" :blueprints="processes" />
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
import { useProcessStore, ProcessProvider } from "@/stores/process.store";
import { useQueryStore, QueryProvider } from "@/stores/query.store.js";
import { deepCopy } from "@/services/clone.service.js";
import { isDiff } from "@/services/diff.service.js";
import ItemSelectorComponent from "./ItemSelectorComponent.vue";
import BtnComponent from "./BtnComponent.vue";
import QueryComponent from "./QueryComponent.vue";
import ProcessesComponent from "./ProcessesComponent.vue";

export default {
  name: "QueryManagerComponent",
  components: {
    ItemSelectorComponent,
    BtnComponent,
    QueryComponent,
    ProcessesComponent,
  },
  setup() {
    const nav = new NavigationService(useRouter());

    const processProvider = new ProcessProvider(useProcessStore());
    const { processes, refresh, syncAll, isStillRunning } = processProvider;

    const loadingProvider = new LoadingProvider(useLoadingStore());
    const { isLoading } = loadingProvider;

    const projectProvider = new ProjectDetailsProvider(
      useProjectDetailsStore()
    );
    const {
      enrichedQueries,
      queries,
      addQuery,
      removeQuery,
      mapQueriesToProcesses,
      runQueries,
    } = projectProvider;

    const queryProvider = new QueryProvider(useQueryStore());
    const { init, state, isStateValid } = queryProvider;

    let originalState = {};
    const isModified = computed(() => isDiff(queries.value, originalState));

    const editing = ref(false);
    const gathering = ref(false);
    const canSave = computed(() => isStateValid.value);
    const isNew = computed(() => nav.isNew);

    const data = reactive({
      init,
      canSave,
      isLoading,
      enrichedQueries,
      editing,
      gathering,
      isNew,
      processes,
      isModified,
    });

    const handleGatheringProcessesComplete = () => {
      processes.value = [];
      gathering.value = false;
    };

    const handleItemClick = (e) => {
      editing.value = true;

      const item = queries.value.find((i) => i.name === e.item.name);
      data.init(item);
    };

    const handleDeleteClick = (e) => {
      removeQuery(e.item.name);
      originalState = deepCopy(queries.value);
    };

    const handleAddClick = () => {
      editing.value = true;
      data.init();
    };

    const handleSaveClick = () => {
      data.isLoading = true;
      const query = state.value;
      const existing = queries.value.find((i) => i.name === query.name);

      if (existing) {
        existing.ql = query.ql;
      } else {
        const clone = deepCopy(query);
        addQuery(clone);
      }

      editing.value = false;
      originalState = deepCopy(queries.value);
    };

    const handleGatherAllClick = async () => {
      const procs = mapQueriesToProcesses(nav.projId);

      processes.value = procs;
      gathering.value = true;

      await syncAll();
      await runQueries(procs);

      initProcessInterval();
    };

    const handleCloseClick = () => {
      data.init();
      editing.value = false;
    };

    const initProcessInterval = () => {
      let intervalId = setInterval(async () => {
        if (isStillRunning.value) {
          // console.log("processes still running, refreshing...");
          await refresh();
        } else {
          // console.log("processes finished, cleaning interval...");
          clearInterval(intervalId);
          setTimeout(() => {
            handleGatheringProcessesComplete();
          }, 2000);
        }
      }, 3000);
    };

    const initState = () => {
      // console.log("initState", "isNewProject", nav.isNewProject());
      editing.value = nav.isNewProject();
      originalState = deepCopy(queries.value);
    };

    onMounted(() => {
      initState();
    });

    return {
      ...toRefs(data),
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
