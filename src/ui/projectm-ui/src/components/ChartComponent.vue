<template>
  <q-layout view="Lhh lpR fff Rt">
    <q-page-container>
      <q-drawer
        v-if="listPanelSupported"
        v-model="rightDrawerOpen"
        :width="350"
        show-if-above
        bordered
        side="right"
      >
        <div style="height: 50px"></div>
        <ListComponent />
      </q-drawer>

      <div 
        class="q-gutter-md q-justify-end"
        v-if="listPanelSupported">
        <q-btn
          flat
          dense
          round
          @click="handleMenuToggleClick"
          aria-label=""
          icon="menu"
        />
      </div>

      <div v-if="chartFiltersSupported">
        <q-expansion-item
          v-model="isExpanded"
          expand-separator
          label="Filters"
          caption=""
        >
          <q-card bordered>
            <filter-controls-component @filter="handleFilter" />
          </q-card>
        </q-expansion-item>
      </div>
      <div v-if="chartSummarySupported">
        <div v-if="avgVal">
          <span class="larger-font">Select Average: </span>
          <q-badge class="larger-font" rounded :color="avgColor">{{
            avgVal
          }}</q-badge>
        </div>
        <div v-if="projAvgVal">
          <span class="larger-font">Project Average: </span>
          <q-badge class="larger-font" rounded :color="projAvgColor">{{
            projAvgVal
          }}</q-badge>
        </div>
      </div>
      <br />
      <q-page class="flex flex-center">
        <div class="chart-container" ref="chartContainer"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { toRefs, ref, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import {
  useStructuresStore,
  StructuresProvider,
} from "@/stores/structures.store.js";
import {
  CHARTS_SUPPORTING_FILTERS,
  CHARTS_SUPPORTING_SUMMARY,
  CHARTS_SUPPORTING_LIST_PANEL,
  getChartSvgBuilder,
} from "@/services/charts.service.js";
import FilterControlsComponent from "./FilterControlsComponent.vue";
import ListComponent from "./ListComponent.vue";
import { filterTree, getTasks } from "@/fns/tree.fns";
import { getBadgeColor, getRiskText } from "@/services/color.service";

export default {
  name: "ChartComponent",
  components: { FilterControlsComponent, ListComponent },
  setup() {
    const router = useRouter();
    const nav = new NavigationService(router);
    const provider = new StructuresProvider(useStructuresStore());
    const { getWeightedTree, isInitialized } = provider;

    const chartContainer = ref(null);
    const chartFiltersSupported = ref(false);
    const chartSummarySupported = ref(false);
    const listPanelSupported = ref(CHARTS_SUPPORTING_LIST_PANEL.includes(nav.chartId));

    const rightDrawerOpen = ref(false);
    const originalDataset = ref([]);
    const dataset = ref([]);
    const accumFilterFn = ref(null);
    // const isExpanded = ref(chartFiltersSupported.value);
    const isExpanded = ref(false);

    const avgColor = ref(null);
    const avgVal = ref(null);
    const avgText = ref(null);
    const projAvgColor = ref(null);
    const projAvgVal = ref(null);

    const data = reactive({
      isExpanded,
      getWeightedTree,
      isInitialized,
      chartFiltersSupported,
      chartSummarySupported,
      listPanelSupported,
      rightDrawerOpen,
      chartContainer,
      avgColor,
      avgVal,
      avgText,
      projAvgColor,
      projAvgVal,
    });

    const handleMenuToggleClick = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    };

    const handleFilter = (e) => {
      if (!isExpanded.value) return;
      const { severities, rags, risk_impact_range, tagFilter, defaulted } = e;
      const ragFn = (node) => rags.includes(node.rag_status);
      const riskImpactFn = (node) =>
        node.risk_impact >= risk_impact_range.min &&
        node.risk_impact <= risk_impact_range.max;
      const severityVals = severities.map((s) => s.value);
      const severityFn = (node) => severityVals.includes(node.severity);
      const defaultedFn = (node) => {
        return defaulted === true ? node.defaulted === true : true;
      };

      const tagsFn = (node) => {
        if (tagFilter.or) {
          const filtered = node.tags.filter((t) => tagFilter.tags.includes(t));
          return filtered.length > 0;
        }

        let accum = tagFilter.or;
        node.tags.forEach((t) => {
          accum = accum && tagFilter.tags.includes(t);
        });
        return accum;
      };

      const fn = (node) => {
        return (
          tagsFn(node) &&
          riskImpactFn(node) &&
          severityFn(node) &&
          ragFn(node) &&
          defaultedFn(node)
        );
      };

      accumFilterFn.value = fn;
    };

    const updateProjAvg = () => {
      if (originalDataset.value.length === 0) return;

      const tasks = [];
      getTasks(originalDataset.value, tasks);

      let total = 0;
      for (const task of tasks) {
        total += task.risk_impact;
      }

      const avg = total / tasks.length;
      projAvgColor.value = getBadgeColor(avg);
      projAvgVal.value = `${avg.toFixed(2)} (${getRiskText(avg)})`;
    };

    const updateAvg = () => {
      if (dataset.value.length === 0) return;

      const tasks = [];
      getTasks(dataset.value, tasks);

      let total = 0;
      for (const task of tasks) {
        total += task.risk_impact;
      }

      const avg = total / tasks.length;
      avgColor.value = getBadgeColor(avg);
      avgVal.value = `${avg.toFixed(2)} (${getRiskText(avg)})`;
    };

    const refreshDataset = () => {
      const data = getWeightedTree.value;
      originalDataset.value = data;

      if (!data) {
        console.warn("refreshDataset", "no data");
        dataset.value = [];
        return;
      }

      const filterFns = accumFilterFn.value ? [accumFilterFn.value] : [];
      const filtered = filterTree(data, filterFns);

      dataset.value = filtered;
    };

    const renderChart = () => {
      removeSvgs();

      if (!dataset.value) {
        console.warn("renderChart", "no data");
        return;
      }

      const chartType = nav.chartId;
      const svgBuilder = getChartSvgBuilder(chartType);
      const svg = svgBuilder(dataset.value);

      const container = chartContainer.value;

      container.appendChild(svg);
    };

    const removeSvgs = () => {
      const container = chartContainer.value;
      if (container && container.childNodes.length > 0) {
        for (const childNode of Array.from(container.childNodes)) {
          if (childNode.tagName === "svg" || childNode.tagName === "SVG") {
            container.removeChild(childNode);
          }
        }
      }
    };

    const initState = () => {
      chartFiltersSupported.value = CHARTS_SUPPORTING_FILTERS.includes(
        nav.chartId
      );
      // isExpanded.value = chartFiltersSupported.value;
      chartSummarySupported.value = CHARTS_SUPPORTING_SUMMARY.includes(
        nav.chartId
      );
    };

    watch(
      () => getWeightedTree.value,
      () => {
        refreshDataset();
      }
    );

    watch(
      () => accumFilterFn.value,
      () => {
        refreshDataset();
      }
    );

    watch(
      () => dataset.value,
      () => {
        renderChart();
        updateAvg();
      }
    );

    watch(
      () => originalDataset.value,
      () => {
        updateProjAvg();
      }
    );

    onMounted(async () => {
      await provider.init(nav.projId);
      initState();
    });

    return { ...toRefs(data), handleFilter, handleMenuToggleClick };
  },
};
</script>

<style scoped>
.larger-font {
  font-size: larger;
}

.chart-container {
  width: 100%;
  height: 100vh;
}

.q-expansion-item {
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* .rect {
  fill: lightblue;
  stroke: black;
  stroke-width: 2;
} */

</style>
