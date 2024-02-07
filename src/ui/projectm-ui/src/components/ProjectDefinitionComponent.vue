<template>
  <q-page>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-tab name="queries" icon="rule" label="" />
          <q-tab name="actions" icon="build" label="" />
          <q-tab name="info" icon="info" label="" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="queries">
            <div class="text-h4 q-mb-md">Queries</div>
            <QueryManagerComponent />
          </q-tab-panel>

          <q-tab-panel name="actions">
            <div class="text-h4 q-mb-md">Actions</div>
            <ActionsManagerComponent />
          </q-tab-panel>

          <q-tab-panel name="info">
            <div class="text-h4 q-mb-md">Info</div>
            <ProjectDetailsComponent />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <FabActionComponent>
      <BtnComponent
        v-if="isModified && canSave"
        icon="save"
        @click="handleSaveClick"
      />
    </FabActionComponent>
  </q-page>
</template>
<script>
import { computed, onMounted, reactive, toRefs, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import {
  useProjectDetailsStore,
  ProjectDetailsProvider,
} from "@/stores/project-details.store";
import { useQueryStore, QueryProvider } from "@/stores/query.store";
import QueryManagerComponent from "./QueryManagerComponent.vue";
import ProjectDetailsComponent from "./ProjectDetailsComponent.vue";
import FabActionComponent from "./FabActionComponent.vue";
import BtnComponent from "./BtnComponent.vue";
import { isDiff } from "@/services/diff.service";
import { deepCopy } from "@/services/clone.service";
import ActionsManagerComponent from "./ActionsManagerComponent.vue";

export default {
  name: "ProjectDefinitionComponent",
  components: {
    QueryManagerComponent,
    ProjectDetailsComponent,
    FabActionComponent,
    BtnComponent,
    ActionsManagerComponent
},
  props: {
    tabId: {
      type: String,
      default: () => "queries",
    },
  },
  setup(props) {
    const router = useRouter();
    const nav = new NavigationService(router);
    const projectStore = useProjectDetailsStore();
    const projectProvider = new ProjectDetailsProvider(projectStore);
    const queryStore = useQueryStore();
    const queryProvider = new QueryProvider(queryStore);

    const tab = ref(props.tabId);
    watch(
      () => tab.value,
      (val) => {
        router.replace({ query: { tab: val } });
      }
    );
    const {
      id,
      name,
      description,
      owner,
      queries,
      color,
      isStateValid,
      sync,
      state,
    } = projectProvider;

    const canSave = computed(() => isStateValid.value);

    let originalState = {};
    const isModified = ref(false);
    watch(
      state.value,
      (newVal) => {
        isModified.value = isDiff(newVal, originalState);
      },
      { deep: true }
    );

    const data = reactive({
      id,
      name,
      description,
      owner,
      queries,
      color,
      canSave,
      isModified,
    });

    const handleSaveClick = async () => {
      await sync();
      nav.goToProjects();
    };

    onMounted(async () => {
      await projectProvider.init(nav.projId);
      queryProvider.init(queries);
      originalState = deepCopy(state.value);
    });

    return {
      ...toRefs(data),
      tab,
      handleSaveClick,
    };
  },
};
</script>
<style></style>
