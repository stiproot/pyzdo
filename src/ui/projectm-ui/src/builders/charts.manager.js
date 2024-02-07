import { filterByType } from "../fns/data.fns.js";

import { buildNestedTreeMapSvg } from "./nested-treemap.builder.js";
import { buildForceDirectedTreeSvg } from "./force-directed-tree.builder.js";
import { buildPackedCircleSvg } from "./packed-circle.builder.js";
import { buildSimplePackedCircleSvg } from "./simple-packed-circle.builder.js";
import { buildSunburstSvg } from "./sunburst.builder.js";
// import { buildSunburstV2Svg } from "./sunburst.builder.v2.js";
import { buildZoomableSunburstSvg } from "./zoomable-sunburst.builder.js";
import { buildTidyTreeSvg } from "./tidy-tree.builder.js";
import { buildBubbleChartSvg } from "./bubble-chart.builder.js";
import { buildRadialClusterSvg } from "./radial-cluster.builder.js";
import { buildSequencesSunburstSvg } from "./sequences-sunburst.builder.js";
import { buildGridSvg } from "./grid.builder.js";
import { buildMldlcSvg } from "./mldlc.builder.js";
import { buildSdlcSvg } from "./sdlc.builder.js";

export function buildNestedTreeMap(data) {
  const tasks = filterByType(data, "Task");
  const root = {
    id: "",
    type: "",
    title: "project",
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

export function buildSimplePackedCircle(data) {
  const root = data;
  root.title = "root";
  root.id = 0;
  return buildSimplePackedCircleSvg(root);
}

export function buildSunburst(data) {
  const root = data;
  root.title = "root";
  return buildSunburstSvg(root);
}

export function buildTidyTree(data) {
  // const root = data;
  // root.title = "";
  // root.id = 0;
  const root = data.children[0];
  return buildTidyTreeSvg(root);
}

export function buildZoomableSunburst(data) {
  const root = data;
  root.title = "root";
  root.id = 0;
  return buildZoomableSunburstSvg(root);
}

export function buildBubbleChart(data) {
  const tasks = filterByType(data, "Task");
  return buildBubbleChartSvg(tasks);
}

export function buildRadialCluster(data) {
  const root = data;
  root.title = "";
  root.id = 0;
  return buildRadialClusterSvg(root);
}

export function buildSequencesSunburst(data) {
  const root = data;
  root.title = "root";
  root.id = 0;
  return buildSequencesSunburstSvg(root);
}

export function buildGrid(data) {
  const tasks = filterByType(data, "Task");
  // const root = {
  //   id: "",
  //   type: "",
  //   title: "project",
  //   children: tasks,
  // };
  const svg = buildGridSvg(tasks);
  return svg;
}

export function buildMldlc(data) {
  const svg = buildMldlcSvg(data);
  return svg;
}

export function buildSdlc(data) {
  const svg = buildSdlcSvg(data);
  return svg;
}