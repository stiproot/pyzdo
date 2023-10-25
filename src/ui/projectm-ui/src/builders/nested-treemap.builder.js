import * as d3 from "d3";

export function buildNestedTreeMapSvg(data, max = 100) {
  console.log("max", max);
  const width = window.innerWidth;
  const height = window.innerHeight;

  // const color = d3
  //   .scaleLinear()
  //   .domain([0, max / 2, max])
  //   .range(["#FFFFFF", "#268BD2", "#DA3637"]);

  const color = (d) => {
    if (d.type !== "Task") return "#FFFFFF";
    const w = d.risk_weight || 0;
    if (w > 30) {
      return "#DA3637";
    }
    if (w > 20) {
      return "#FFC107";
    }
    return "#77DD77";
  };

  const treemapFn = d3
    .treemap()
    .size([width, height])
    .paddingOuter(3)
    .paddingTop(19)
    .paddingInner(1)
    .round(true);

  const hierachy = d3
    .hierarchy(data)
    .sum((d) => d.risk_weight)
    .sort((a, b) => b.value - a.value);

  const root = treemapFn(hierachy);

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr(
      "style",
      "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;"
    );

  const shadowId = `shadow-${Math.random().toString(36).substr(2, 9)}`;
  const nodeUidId = `nodeUid-${Math.random().toString(36).substr(2, 9)}`;
  const clipUidId = `clipUid-${Math.random().toString(36).substr(2, 9)}`;

  svg
    .append("filter")
    .attr("id", shadowId)
    .append("feDropShadow")
    .attr("flood-opacity", 0.3)
    .attr("dx", 0)
    .attr("stdDeviation", 3);

  const node = svg
    .selectAll("g")
    .data(d3.group(root, (d) => d.height))
    .join("g")
    .attr("filter", `url(#${shadowId})`)
    .selectAll("g")
    .data((d) => d[1])
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  const format = d3.format(",d");
  node.append("title").text(
    (d) =>
      `${d
        .ancestors()
        .reverse()
        .map((d) => d.data.title)
        .join("/")}\n${format(d.value)}`
  );

  node
    .append("rect")
    .attr("id", (d) => (d.nodeUid = nodeUidId).id)
    .attr("fill", (d) => color(d.data))
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  node
    .append("clipPath")
    .attr("id", (d) => (d.clipUid = clipUidId).id)
    .append("use")
    .attr("xlink:href", (d) => d.nodeUid.href);

  node
    .append("text")
    .attr("clip-path", (d) => d.clipUid)
    .selectAll("tspan")
    .data((d) => [format(d.value), d.data.type].concat(d.data.title.split(" ")))
    .join("tspan")
    .text((d) => d);

  node
    .filter((d) => d.children)
    .selectAll("tspan")
    .attr("dx", 3)
    .attr("y", 13);

  node
    .filter((d) => !d.children)
    .selectAll("tspan")
    .attr("x", 3)
    .attr(
      "y",
      (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
    );

  return svg.node();
}
