<template>
  <div>
    <filter-controls-component @filter="handleFilter" />
  </div>
  <q-page class="flex flex-center">
    <div ref="chartContainer"></div>
  </q-page>
</template>
<script>
import { toRefs, ref, reactive, onMounted, onUpdated } from "vue";
import { useRouter } from "vue-router";
import { NavigationService } from "@/services/navigation.service";
import {
  useStructuresStore,
  StructuresProvider,
} from "@/stores/structures.store.js";
import {
  STRUCTURE_TYPES,
  getChartStructureType,
  getChartSvgBuilder,
} from "@/services/charts.service.js";
import FilterControlsComponent from "./FilterControlsComponent.vue";
/* import { */
/*   buildTagFilterPredicate, */
/*   buildSeverityFilterPredicate, */
/*   buildRiskWeightPredicate, */
/* } from "@/fns/filter.fns"; */
import { filterTree } from "@/fns/tree.fns";
export default {
  name: "ChartComponent",
  components: { FilterControlsComponent },
  setup() {
    const router = useRouter();
    const nav = new NavigationService(router);
    const store = useStructuresStore();
    const provider = new StructuresProvider(store);
    const chartContainer = ref(null);

    const { getWeightedTree, getSummarizedTree, isInitialized } = provider;
    const data = reactive({
      getWeightedTree,
      getSummarizedTree,
      isInitialized,
    });

    const DATA_HASH = {
      [STRUCTURE_TYPES.WEIGHTED_TREE]: () => data.getWeightedTree,
      [STRUCTURE_TYPES.SUMMARIZED_TREE]: () => data.getSummarizedTree,
    };

    onMounted(async () => {
      provider.initThen(nav.projId, () => {
        renderChart(nav.chartId);
      });
    });

    onUpdated(async () => {
      provider.initThen(nav.projId, () => {
        renderChart(nav.chartId);
      });
    });

    /* let filters = []; */
    /* let tagFilters = []; */
    /* let sevFilters = []; */
    /* let riskWeightFilters = []; */

    function handleFilter(e) {
      console.log("chartComponent: handleFilter", e);

      const { severities, roles, rags, risk_weight } = e;
      const severityVals = severities.map((s) => s.value);

      console.log("rags", rags);

      const riskWeightFn = (node) => {
        return node.risk_weight >= risk_weight;
      };
      const rolesFn = (node) => {
        const filtered = node.tags.filter((t) => roles.includes(t));
        return filtered.length > 0;
      };
      const severityFn = (node) => {
        return severityVals.includes(node.severity);
      };

      /* const ragsFn = (node) => { */
      /*   return rags.includes(node.rag); */
      /* }; */

      const fn = (node) => {
        return riskWeightFn(node) && rolesFn(node) && severityFn(node);
      };

      renderChart(nav.chartId, [fn]);
    }

    /* function handleFilter(e) { */
    /*   console.log("chartComponent: handleFilter", e); */
    /*   filters = []; */
    /*   const { severities, roles, rags, risk_weight } = e; */

    /*   const tags = [...roles, ...rags]; */
    /*   const sevs = severities.map((s) => s.value); */

    /*   const tagPreds = tags.map((t) => buildTagFilterPredicate(t)); */
    /*   const sevPred = buildSeverityFilterPredicate(sevs); */
    /*   const riskWeightPred = buildRiskWeightPredicate(risk_weight); */

    /*   filters.push(...tagPreds); */
    /*   tagFilters.push(...tagPreds); */
    /*   filters.push(sevPred); */
    /*   sevFilters.push(sevPred); */
    /*   filters.push(riskWeightPred); */
    /*   riskWeightFilters.push(riskWeightPred); */

    /*   renderChart(nav.chartId); */
    /* } */

    function renderChart(chartType, filterFns = []) {
      removeSvgs();

      if (provider.isInitialized.value === false) {
        return;
      }

      const structureType = getChartStructureType(chartType);
      const svgBuilder = getChartSvgBuilder(chartType);
      const data = DATA_HASH[structureType]();
      if (!data) {
        return;
      }

      /* let filtered = data; */
      /* filtered = filterTree(filtered, tagFilters); */
      /* filtered = filterTree(filtered, sevFilters); */
      /* filtered = filterTree(filtered, riskWeightFilters); */

      let filtered = filterTree(data, filterFns);
      const svg = svgBuilder(filtered);
      const container = chartContainer.value;

      container.appendChild(svg);
    }

    function removeSvgs() {
      const container = chartContainer.value;
      if (container && container.childNodes.length > 0) {
        for (const childNode of Array.from(container.childNodes)) {
          if (childNode.tagName === "svg" || childNode.tagName === "SVG") {
            container.removeChild(childNode);
          }
        }
      }
    }

    return { ...toRefs(data), chartContainer, handleFilter };
  },
};
</script>

<style scoped></style>
