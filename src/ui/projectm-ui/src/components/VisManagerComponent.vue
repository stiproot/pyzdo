<template>
  <div>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-tab name="charts" icon="code" label="" />
          <q-tab name="structures" icon="category" label="" />
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
          <q-tab-panel name="charts">
            <div class="text-h4 q-mb-md">Charts</div>
            <ChartManagerComponent />
          </q-tab-panel>

          <q-tab-panel name="structures">
            <div class="text-h4 q-mb-md">Structures</div>
            <StructureManagerComponent />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script>
import { watch, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import {
  useStructuresStore,
  StructuresProvider,
} from "@/stores/structures.store";
import ChartManagerComponent from "./ChartManagerComponent.vue";
import StructureManagerComponent from "./StructureManagerComponent.vue";
export default {
  name: "VisManagerComponent",
  components: {
    ChartManagerComponent,
    StructureManagerComponent,
  },
  props: {
    tabId: {
      type: String,
      default: () => "charts",
    },
  },
  setup(props) {
    const router = useRouter();
    const nav = new NavigationService(router);

    const structuresStore = useStructuresStore();
    const structuresProvider = new StructuresProvider(structuresStore);

    const tab = ref(props.tabId);
    watch(
      () => tab.value,
      (val) => {
        router.replace({ query: { tab: val } });
      }
    );

    onMounted(async () => {
      console.log(
        "VisManagerComponent mounted",
        "props.tabId:",
        props.tabId,
        "nav.projId:",
        nav.projId
      );
      await structuresProvider.init(nav.projId);
    });

    return {
      tab,
    };
  },
};
</script>
<style>
.float-right {
  float: right;
}
</style>
