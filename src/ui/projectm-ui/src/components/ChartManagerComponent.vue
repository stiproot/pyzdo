<template>
  <ItemSelectorComponent
    v-if="!showChart"
    :items="charts"
    @item-click="handleChartClick"
  />

  <router-view></router-view>

  <FabActionComponent>
    <BtnComponent
      style="background-color: white"
      icon="close"
      color="secondary"
      v-if="showChart"
      @click="handleCloseClick"
    />
  </FabActionComponent>
</template>
<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import ItemSelectorComponent from "./ItemSelectorComponent.vue";
import FabActionComponent from "./FabActionComponent.vue";
import BtnComponent from "./BtnComponent.vue";
import {
  CHART_TYPES_LIST,
  CHART_TYPE_RGB_COLOR_HASH,
} from "@/services/charts.service";

export default {
  name: "ChartManagerComponent",
  components: {
    ItemSelectorComponent,
    FabActionComponent,
    BtnComponent,
  },
  setup() {
    const router = useRouter();
    const nav = new NavigationService(router);

    const enrichData = (data) => {
      data.forEach((c) => {
        c.color = CHART_TYPE_RGB_COLOR_HASH[c.id];
        c.icon = c.in_progress ? "construction" : null;
        c.actions = [
          {
            evtId: "item-click",
            btnText: "view",
          },
        ];
      });
    };

    enrichData(CHART_TYPES_LIST);
    const charts = ref(CHART_TYPES_LIST);
    const chartType = ref(null);
    const showChart = computed(() => nav.chartId !== undefined);

    const handleChartClick = (e) => {
      nav.goToChart(nav.projId, e.item.id);
    };

    function handleCloseClick() {
      nav.goToVis(nav.projId);
      chartType.value = null;
    }

    onMounted(() => {
      console.log(
        "chartManager",
        "onMounted",
        `projId: ${nav.projId}`,
        `chartId: ${nav.chartId}`
      );
    });

    return {
      charts,
      handleChartClick,
      handleCloseClick,
      showChart,
      chartType,
    };
  },
};
</script>
<style>
.card-width {
  max-width: 250px;
}
</style>
