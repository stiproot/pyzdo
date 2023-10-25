import { filterByType } from "../fns/data.fns.js";

import { buildNestedTreeMapSvg } from "./nested-treemap.builder.js";
import { buildForceDirectedTreeSvg } from "./force-directed-tree.builder.js";
import { buildPackedCircleSvg } from "./packed-circle.builder.js";
import { buildSunburstSvg } from "./sunburst.builder.js";
import { buildTidyTreeSvg } from "./tidy-tree.builder.js";

export function buildNestedTreeMap(data) {
  const tasks = filterByType(data, "Task");
  const root = {
    id: "root",
    type: "root",
    title: "root",
    children: tasks,
  };
  const svg = buildNestedTreeMapSvg(root);
  return svg;
}

export function buildForceDirectedTree(data) {
  const root = data;
  root.title = "root";
  return buildForceDirectedTreeSvg(root);
}

export function buildPackedCircle(data) {
  const root = data;
  root.title = "root";
  return buildPackedCircleSvg(root);
}

export function buildSunburst(data) {
  const root = data;
  root.title = "root";
  return buildSunburstSvg(root);
}

export function buildTidyTree(data) {
  const root = data;
  root.title = "root";
  root.id = 0;
  return buildTidyTreeSvg(root);
}
