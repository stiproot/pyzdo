<template>
  <div v-if="!viewing && !editing" class="qa-pa-md row items-start q-gutter-md">
    <ItemSelectorComponent
      :items="projects"
      @view-click="handleViewClick"
      @visuals-click="handleVisualsClick"
      @actions-click="handleActionsClick"
    />
  </div>

  <FabActionComponent>
    <BtnComponent icon="add" @click="handleAddClick" />
  </FabActionComponent>
</template>

<script>
import { reactive, toRefs, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useLoadingStore, LoadingProvider } from "@/stores/loading.store";
import { useProjectsStore, ProjectsProvider } from "@/stores/projects.store";
import { NavigationService } from "@/services/navigation.service";
import ItemSelectorComponent from "./ItemSelectorComponent.vue";
import FabActionComponent from "./FabActionComponent.vue";
import BtnComponent from "./BtnComponent.vue";
export default {
  name: "ProjectManagerComponent",
  components: { ItemSelectorComponent, FabActionComponent, BtnComponent },
  setup() {
    const router = useRouter();
    const nav = new NavigationService(router);
    const loadingStore = useLoadingStore();
    const loadingProvider = new LoadingProvider(loadingStore);
    const projectsStore = useProjectsStore();
    const projectsProvider = new ProjectsProvider(projectsStore);
    const INTERVAL_TIME = 2000;

    const { isLoading } = loadingProvider;
    const { enrichedProjects } = projectsProvider;
    const data = reactive({ projects: enrichedProjects, isLoading });

    const handleViewClick = (e) => {
      nav.goToProjectDefinition(e.item.id);
    };

    const handleVisualsClick = (e) => {
      nav.goToVis(e.item.id);
    };

    const handleActionsClick = (e) => {
      nav.goToActions(e.item.id);
    };

    const handleAddClick = () => {
      nav.newProject();
    };

    let intervalId = 0;
    const initInterval = () => {
      intervalId = setInterval(async () => {
        // data.isLoading = true;
        await projectsProvider.init();
      }, INTERVAL_TIME);
    };

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });

    onMounted(async () => {
      data.isLoading = true;
      await projectsProvider.init();
      initInterval();
    });

    return {
      ...toRefs(data),
      handleViewClick,
      handleVisualsClick,
      handleActionsClick,
      handleAddClick,
    };
  },
};
</script>
<style>
.card-width {
  width: 250px;
}
</style>
