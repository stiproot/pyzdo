import {
  buildNestedTreeMap,
  buildTidyTree,
  buildForceDirectedTree,
  buildPackedCircle,
  buildSunburst,
} from "@/builders/charts.manager.js";
import { kebabToUpperCaseSnake } from "@/fns/case.fns.js";

export const CHART_TYPES = {
  NESTED_TREEMAP: "NESTED_TREEMAP",
  PACKED_CIRCLE: "PACKED_CIRCLE",
  SUNBURST: "SUNBURST",
  TIDY_TREE: "TIDY_TREE",
  FORCE_DIRECTED_TREE: "FORCE_DIRECTED_TREE",
};

export const CHART_TYPE_ID_HASH = {
  [CHART_TYPES.NESTED_TREEMAP]: "nested-treemap",
  [CHART_TYPES.PACKED_CIRCLE]: "packed-circle",
  [CHART_TYPES.SUNBURST]: "sunburst",
  [CHART_TYPES.FORCE_DIRECTED_TREE]: "force-directed-tree",
  [CHART_TYPES.TIDY_TREE]: "tidy-tree",
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
  [CHART_TYPES.TIDY_TREE]: STRUCTURE_TYPES.SUMMARIZED_TREE,
};

export const CHART_TYPE_TO_BUILDER_HASH = {
  [CHART_TYPES.NESTED_TREEMAP]: buildNestedTreeMap,
  [CHART_TYPES.PACKED_CIRCLE]: buildPackedCircle,
  [CHART_TYPES.SUNBURST]: buildSunburst,
  [CHART_TYPES.TIDY_TREE]: buildTidyTree,
  [CHART_TYPES.FORCE_DIRECTED_TREE]: buildForceDirectedTree,
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
  { id: "nested-treemap", description: "Nested Treemap" },
  { id: "tidy-tree", description: "Tidy Tree" },
  { id: "packed-circle", description: "Packed Circles" },
  { id: "sunburst", description: "Sunburst" },
  { id: "force-directed-tree", description: "Force directed tree" },
];

// const DATA_SRC_HASH = {
//   [STRUCTURE_TYPES.WEIGHTED_TREE]: () => data.getWeightedTree,
//   [STRUCTURE_TYPES.SUMMARIZED_TREE]: () => data.getSummarizedTree,
// };
