<template>
  <div>
    <ItemSelectorComponent
      v-if="!showChart"
      :items="charts"
      @item-click="handleChartClick"
    />
  </div>

  <router-view></router-view>
  <div>
    <FabActionComponent>
      <BtnComponent
        icon="close"
        color="secondary"
        v-if="showChart"
        @click="handleCloseClick"
      />
    </FabActionComponent>
  </div>
</template>
<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import ItemSelectorComponent from "./ItemSelectorComponent.vue";
import FabActionComponent from "./FabActionComponent.vue";
import BtnComponent from "./BtnComponent.vue";
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

    const COLOR_HASH = {
      "nested-treemap": "rgb(255, 238, 121)",
      "tidy-tree": "rgb(216, 239, 251)",
      "packed-circle": "rgb(91, 142, 145)",
      sunburst: "rgb(249, 85, 88)",
      "force-packed-tree": "rgb(133, 87, 3)",
    };

    const enrichData = (data) => {
      data.forEach((c) => {
        c.color = COLOR_HASH[c.id];
        c.subTitle = c.id;
        c.actions = [
          {
            evtId: "item-click",
            btnText: c.id,
          },
        ];
      });
    };

    const chartTypes = [
      { id: "nested-treemap", description: "Nested Treemap" },
      { id: "tidy-tree", description: "Tidy Tree" },
      { id: "packed-circle", description: "Packed Circles" },
      { id: "sunburst", description: "Sunburst" },
      { id: "force-directed-tree", description: "Force directed tree" },
    ];

    enrichData(chartTypes);
    const charts = ref(chartTypes);
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
