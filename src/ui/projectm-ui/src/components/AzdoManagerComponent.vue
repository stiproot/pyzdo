<template>
  <q-card flat bordered>
    <q-card-section horizontal>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-icon color="blue" name="widgets" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Azure DevOps</q-item-label>
          <q-item-label caption> </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator vertical />
      <q-card-section>Azure DevOps Work Item functions.</q-card-section>
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
    <q-tab name="wis" label="Work Items" @click="handleTabClick" />
    <q-tab name="dashboards" label="Dashboards" @click="handleTabClick" />
  </q-tabs>

  <q-separator />

  <router-view></router-view>
</template>
<script>
import { ref, onMounted, toRefs, reactive } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
export default {
  name: "AzdoManagerComponent",
  setup() {
    const router = useRouter();
    const nav = new NavigationService(router);
    const data = reactive({});

    const tab = ref(nav.azdoDims());

    const handleTabClick = () => {
      if (tab.value === "wis") {
        nav.goToWis();
      }
      if (tab.value === "dashboards") {
        nav.goToDashboards();
      }
    };

    onMounted(async () => {});

    return {
      tab,
      handleTabClick,
      ...toRefs(data),
    };
  },
};
</script>
<style></style>
