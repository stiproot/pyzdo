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
import { reactive, toRefs, computed } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import {
  useProjectDetailsStore,
  ProjectDetailsProvider,
} from "@/stores/project-details.store";
export default {
  name: "ProjectDetailsComponent",
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

    return {
      ...toRefs(data),
      handleSaveClick,
    };
  },
};
</script>
<style></style>
