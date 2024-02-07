import {
  buildNestedTreeMap,
  buildTidyTree,
  buildForceDirectedTree,
  buildPackedCircle,
  buildSunburst,
  buildZoomableSunburst,
  buildBubbleChart,
  buildRadialCluster,
  buildSequencesSunburst,
  buildSimplePackedCircle,
  buildGrid,
  buildMldlc,
  buildSdlc
} from "@/builders/charts.manager.js";
import { kebabToUpperCaseSnake } from "@/fns/case.fns.js";

export const DLC_TYPES = {
  SDLC: "SDLC",
  MLDLC: "MLDLC"
}

export const CHART_TYPES = {
  NESTED_TREEMAP: "NESTED_TREEMAP",
  PACKED_CIRCLE: "PACKED_CIRCLE",
  SUNBURST: "SUNBURST",
  TIDY_TREE: "TIDY_TREE",
  FORCE_DIRECTED_TREE: "FORCE_DIRECTED_TREE",
  ZOOMABLE_SUNBURST: "ZOOMABLE_SUNBURST",
  BUBBLE_CHART: "BUBBLE_CHART",
  RADIAL_CLUSTER: "RADIAL_CLUSTER",
  SEQUENCES_SUNBURST: "SEQUENCES_SUNBURST",
  SIMPLE_PACKED_CIRCLE: "SIMPLE_PACKED_CIRCLE",
  GRID: "GRID",
  MLDLC: "MLDLC",
  SDLC: "SDLC"
};

export const CHART_TYPE_ID_HASH = {
  [CHART_TYPES.NESTED_TREEMAP]: "nested-treemap",
  [CHART_TYPES.PACKED_CIRCLE]: "packed-circle",
  [CHART_TYPES.SUNBURST]: "sunburst",
  [CHART_TYPES.FORCE_DIRECTED_TREE]: "force-directed-tree",
  [CHART_TYPES.TIDY_TREE]: "tidy-tree",
  [CHART_TYPES.ZOOMABLE_SUNBURST]: "zoomable-sunburst",
  [CHART_TYPES.BUBBLE_CHART]: "bubble-chart",
  [CHART_TYPES.RADIAL_CLUSTER]: "radial-cluster",
  [CHART_TYPES.SEQUENCES_SUNBURST]: "sequences-sunburst",
  [CHART_TYPES.SIMPLE_PACKED_CIRCLE]: "simple-packed-circle",
  [CHART_TYPES.GRID]: "grid",
  [CHART_TYPES.MLDLC]: "mldlc",
  [CHART_TYPES.SDLC]: "sdlc"
};

export const STRUCTURE_TYPES = {
  SUMMARIZED_TREE: "SUMMARIZED_TREE",
  WEIGHTED_TREE: "WEIGHTED_TREE",
};

export const CHART_TO_STRUCTURE_TYPE_HASH = {
  [CHART_TYPES.NESTED_TREEMAP]: STRUCTURE_TYPES.WEIGHTED_TREE,
  [CHART_TYPES.PACKED_CIRCLE]: STRUCTURE_TYPES.SUMMARIZED_TREE,
  [CHART_TYPES.SUNBURST]: STRUCTURE_TYPES.WEIGHTED_TREE,
  [CHART_TYPES.FORCE_DIRECTED_TREE]: STRUCTURE_TYPES.SUMMARIZED_TREE,
  // [CHART_TYPES.TIDY_TREE]: STRUCTURE_TYPES.SUMMARIZED_TREE,
  [CHART_TYPES.TIDY_TREE]: STRUCTURE_TYPES.SUMMARIZED_TREE,
  [CHART_TYPES.ZOOMABLE_SUNBURST]: STRUCTURE_TYPES.WEIGHTED_TREE,
  [CHART_TYPES.BUBBLE_CHART]: STRUCTURE_TYPES.WEIGHTED_TREE,
  [CHART_TYPES.RADIAL_CLUSTER]: STRUCTURE_TYPES.WEIGHTED_TREE,
  [CHART_TYPES.SEQUENCES_SUNBURST]: STRUCTURE_TYPES.WEIGHTED_TREE,
  [CHART_TYPES.SIMPLE_PACKED_CIRCLE]: STRUCTURE_TYPES.WEIGHTED_TREE,
  [CHART_TYPES.GRID]: STRUCTURE_TYPES.WEIGHTED_TREE,
  [CHART_TYPES.MLDLC]: STRUCTURE_TYPES.SUMMARIZED_TREE,
  [CHART_TYPES.SDLC]: STRUCTURE_TYPES.SUMMARIZED_TREE
};

export const CHART_TYPE_TO_BUILDER_HASH = {
  [CHART_TYPES.NESTED_TREEMAP]: buildNestedTreeMap,
  [CHART_TYPES.PACKED_CIRCLE]: buildPackedCircle,
  [CHART_TYPES.SUNBURST]: buildSunburst,
  [CHART_TYPES.TIDY_TREE]: buildTidyTree,
  [CHART_TYPES.FORCE_DIRECTED_TREE]: buildForceDirectedTree,
  [CHART_TYPES.ZOOMABLE_SUNBURST]: buildZoomableSunburst,
  [CHART_TYPES.BUBBLE_CHART]: buildBubbleChart,
  [CHART_TYPES.RADIAL_CLUSTER]: buildRadialCluster,
  [CHART_TYPES.SEQUENCES_SUNBURST]: buildSequencesSunburst,
  [CHART_TYPES.SIMPLE_PACKED_CIRCLE]: buildSimplePackedCircle,
  [CHART_TYPES.GRID]: buildGrid,
  [CHART_TYPES.MLDLC]: buildMldlc,
  [CHART_TYPES.SDLC]: buildSdlc,
};

export const getChartSvgBuilder = (chartType) => {
  const internalChartType = kebabToUpperCaseSnake(chartType);
  const builder = CHART_TYPE_TO_BUILDER_HASH[internalChartType];

  return builder;
};

export const getChartStructureType = (chartType) => {
  const internalChartType = kebabToUpperCaseSnake(chartType);
  const structureType = CHART_TO_STRUCTURE_TYPE_HASH[internalChartType];

  return structureType;
};

export const CHART_TYPES_LIST = [
  { id: "nested-treemap", description: "Nested Treemap", in_progress: false },
  { id: "tidy-tree", description: "Tidy Tree", in_progress: false },
  { id: "radial-cluster", description: "Radial Cluster", in_progress: false },
  { id: "packed-circle", description: "Packed Circles", in_progress: false },
  { id: "mldlc", description: "MLDLC", in_progress: true },
  { id: "sdlc", description: "SDLC", in_progress: true },
  // {
  //   id: "simple-packed-circle",
  //   description: "Simple Packed Circle",
  //   in_progress: true,
  // },
  // { id: "sunburst", description: "Sunburst", in_progress: true },
  {
    id: "force-directed-tree",
    description: "Force directed tree",
    in_progress: true,
  },
  {
    id: "zoomable-sunburst",
    description: "Zoomable Sunburst",
    in_progress: true,
  },
  // { id: "bubble-chart", description: "Bubble Chart", in_progress: true },
  // {
  //   id: "sequences-sunburst",
  //   description: "Sequences Sunburst",
  //   in_progress: true,
  // },
  // { id: "grid", description: "Grid", in_progress: true },
];

// const DATA_SRC_HASH = {
//   [STRUCTURE_TYPES.WEIGHTED_TREE]: () => data.getWeightedTree,
//   [STRUCTURE_TYPES.SUMMARIZED_TREE]: () => data.getSummarizedTree,
// };

export const CHART_TYPE_RGB_COLOR_HASH = {
  "nested-treemap": "rgb(255, 238, 121)",
  "tidy-tree": "rgb(216, 239, 251)",
  "radial-cluster": "rgb(182, 139, 199)",
  "packed-circle": "rgb(91, 142, 145)",
  sunburst: "rgb(249, 85, 88)",
  "force-directed-tree": "rgb(242, 211, 124)",
  "zoomable-sunburst": "rgb(94, 167, 181)",
  "bubble-chart": "rgb(155, 119, 191)",
  "sequences-sunburst": "rgb(242, 211, 124)",
  "simple-packed-circle": "rgb(174, 201, 155)",
  "sdlc": "rgb(148, 235, 161)",
  "mldlc": "rgb(132, 196, 167)",
};

export const CHARTS_SUPPORTING_FILTERS = [
  CHART_TYPE_ID_HASH[CHART_TYPES.NESTED_TREEMAP],
  CHART_TYPE_ID_HASH[CHART_TYPES.TIDY_TREE],
  CHART_TYPE_ID_HASH[CHART_TYPES.RADIAL_CLUSTER],
];

export const CHARTS_SUPPORTING_SUMMARY = [
  CHART_TYPE_ID_HASH[CHART_TYPES.NESTED_TREEMAP],
];

export const CHARTS_SUPPORTING_LIST_PANEL = [
  CHART_TYPE_ID_HASH[CHART_TYPES.NESTED_TREEMAP],
];
