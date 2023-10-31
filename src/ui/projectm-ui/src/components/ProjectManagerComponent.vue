<template>
  <div v-if="!viewing && !editing" class="qa-pa-md row items-start q-gutter-md">
    <ItemSelectorComponent
      :items="projects"
      @view-click="handleViewClick"
      @visuals-click="handleVisualsClick"
    />
  </div>

  <FabActionComponent>
    <BtnComponent icon="add" @click="handleAddClick" />
  </FabActionComponent>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
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

    const { isLoading } = loadingProvider;
    const { enrichedProjects } = projectsProvider;
    const data = reactive({ projects: enrichedProjects, isLoading });

    const handleViewClick = (e) => {
      nav.goToProjectDefinition(e.item.id);
    };

    const handleVisualsClick = (e) => {
      nav.goToVis(e.item.id);
    };

    const handleAddClick = () => {
      nav.newProject();
    };

    onMounted(async () => {
      data.isLoading = true;
      await projectsProvider.init();
      console.log(process.env.VUE_APP_DEFAULT_QUERY_FOLDER);
    });

    return {
      ...toRefs(data),
      handleViewClick,
      handleVisualsClick,
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
