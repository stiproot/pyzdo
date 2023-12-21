<template>
  <q-card flat bordered>
    <q-card-section horizontal>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-icon :style="{ color: color }" name="interests" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ name }}</q-item-label>
          <q-item-label caption>
            {{ owner }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator vertical />
      <q-card-section>{{ description }}</q-card-section>
    </q-card-section>
  </q-card>
  <br />
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
  >
    <q-tab name="vis" label="Visuals" @click="handleTabClick" />
    <q-tab name="definition" label="Definition" @click="handleTabClick" />
  </q-tabs>

  <br />

  <router-view></router-view>
</template>
<script>
import { ref, onMounted, toRefs, reactive } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import {
  useProjectDetailsStore,
  ProjectDetailsProvider,
} from "@/stores/project-details.store";
export default {
  name: "ProjectRootComponent",
  setup() {
    const router = useRouter();
    const nav = new NavigationService(router);
    const projectStore = useProjectDetailsStore();
    const projectProvider = new ProjectDetailsProvider(projectStore);

    const { id, name, description, owner, queries, color, isStateValid } =
      projectProvider;

    const data = reactive({
      id,
      name,
      description,
      owner,
      queries,
      color,
      isStateValid,
    });

    const tab = ref(nav.projectDimension());

    const handleTabClick = () => {
      if (tab.value === "vis") {
        nav.goToVis(nav.projId);
      }
      if (tab.value === "definition") {
        nav.goToProjectDefinition(nav.projId);
      }
    };

    onMounted(async () => {
      await projectProvider.init(nav.projId);
    });

    return {
      tab,
      handleTabClick,
      ...toRefs(data),
    };
  },
};
</script>
<style>
.card-width {
  max-width: 250px;
}
</style>
