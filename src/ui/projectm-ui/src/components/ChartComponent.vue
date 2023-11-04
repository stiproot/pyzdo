<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer v-model="leftDrawerOpen" show-if-above side="left">
      <div style="height: 50px"></div>
      <ListComponent />
    </q-drawer>

    <q-page-container>
      <div v-if="chartFiltersSupported">
        <q-expansion-item expand-separator label="Filters" caption="">
          <filter-controls-component @filter="handleFilter" />
        </q-expansion-item>
      </div>
      <div v-if="chartSummarySupported">
        <div v-if="avgVal">
          Average:
          <q-badge class="larget-font" rounded :color="avgColor">{{
            avgVal
          }}</q-badge>
        </div>
      </div>
      <q-page class="flex flex-center">
        <div ref="chartContainer"></div>
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
  CHART_TYPES,
  CHART_TYPE_ID_HASH,
  getChartSvgBuilder,
} from "@/services/charts.service.js";
import FilterControlsComponent from "./FilterControlsComponent.vue";
import ListComponent from "./ListComponent.vue";
import { filterTree, getTasks } from "@/fns/tree.fns";
import { getBadgeColor } from "@/services/color.service";

export default {
  name: "ChartComponent",
  components: { FilterControlsComponent, ListComponent },
  setup() {
    const router = useRouter();
    const nav = new NavigationService(router);
    const provider = new StructuresProvider(useStructuresStore());
    const { getWeightedTree, isInitialized } = provider;

    const chartsSupportingFilters = [
      CHART_TYPE_ID_HASH[CHART_TYPES.NESTED_TREEMAP],
    ];
    const chartsSupportingSummary = [
      CHART_TYPE_ID_HASH[CHART_TYPES.NESTED_TREEMAP],
    ];

    const chartContainer = ref(null);
    const chartFiltersSupported = ref(false);
    const chartSummarySupported = ref(false);
    const leftDrawerOpen = ref(true);
    const avgColor = ref(null);
    const avgVal = ref(null);
    const dataset = ref([]);
    const accumFilterFn = ref(null);

    const data = reactive({
      avgColor,
      avgVal,
      getWeightedTree,
      isInitialized,
      chartFiltersSupported,
      chartSummarySupported,
      leftDrawerOpen,
      chartContainer,
    });

    const handleFilter = (e) => {
      const { severities, roles, rags, risk_impact, defaulted } = e;
      const severityVals = severities.map((s) => s.value);

      const ragFn = (node) => rags.includes(node.rag_status);
      const riskImpactFn = (node) => {
        return node.risk_impact >= risk_impact;
      };
      const rolesFn = (node) => {
        const filtered = node.tags.filter((t) => roles.includes(t));
        return filtered.length > 0;
      };
      const severityFn = (node) => {
        return severityVals.includes(node.severity);
      };
      const defaultedFn = (node) => {
        return defaulted === true ? node.defaulted === true : true;
      };

      const fn = (node) => {
        return (
          riskImpactFn(node) &&
          rolesFn(node) &&
          severityFn(node) &&
          ragFn(node) &&
          defaultedFn(node)
        );
      };

      accumFilterFn.value = fn;
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
      avgVal.value = avg.toFixed(2);
      avgColor.value = getBadgeColor(avg);
    };

    const refreshDataset = () => {
      const data = getWeightedTree.value;

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
      chartFiltersSupported.value = chartsSupportingFilters.includes(
        nav.chartId
      );
      chartSummarySupported.value = chartsSupportingSummary.includes(
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

    onMounted(async () => {
      await provider.init(nav.projId);
      initState();
    });

    return { ...toRefs(data), handleFilter };
  },
};
</script>

<style scoped>
.larget-font {
  font-size: larger;
}
</style>
