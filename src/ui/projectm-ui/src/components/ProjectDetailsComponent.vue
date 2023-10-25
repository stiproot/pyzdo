<template>
  <q-form class="q-gutter-md">
    <q-input
      v-model="id"
      label="Id *"
      lazy-rules
      :rules="[(val) => (val && val.length) || 'Id is required']"
    />

    <q-input
      v-model="name"
      label="Name *"
      lazy-rules
      :rules="[(val) => (val && val.length) || 'Name is required']"
    />

    <q-input
      v-model="owner"
      label="Owner *"
      lazy-rules
      :rules="[(val) => (val && val.length) || 'Description is required']"
    />

    <q-input
      v-model="description"
      type="textarea"
      label="Description *"
      lazy-rules
      :rules="[(val) => (val && val.length) || 'Description is required']"
    />

    <q-color v-model="color" style="250px" />
  </q-form>
</template>
<script>
import { onMounted, reactive, toRefs, computed } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import {
  useProjectDetailsStore,
  ProjectDetailsProvider,
} from "@/stores/project-details.store";
/* import FabActionComponent from "./FabActionComponent.vue"; */
/* import BtnComponent from "./BtnComponent.vue"; */
export default {
  name: "ProjectDetailsComponent",
  /* components: { */
  /*   FabActionComponent, */
  /*   BtnComponent, */
  /* }, */
  setup() {
    const router = useRouter();
    const nav = new NavigationService(router);
    const projectStore = useProjectDetailsStore();
    const projectProvider = new ProjectDetailsProvider(projectStore);

    const { id, name, description, owner, queries, color, sync, isStateValid } =
      projectProvider;

    const canSave = computed(() => isStateValid.value);

    const data = reactive({
      id,
      name,
      description,
      owner,
      queries,
      color,
      isStateValid,
      canSave,
    });

    const handleSaveClick = async () => {
      await sync();
      nav.goToProjects();
    };

    onMounted(async () => {
      // await projectProvider.init(nav.projId);
    });

    return {
      ...toRefs(data),
      handleSaveClick,
    };
  },
};
</script>
<style></style>
