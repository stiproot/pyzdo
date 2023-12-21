import * as d3 from "d3";

function getColor(riskImpact) {
  if (riskImpact >= 0 && riskImpact <= 30) {
    return "green";
  } else if (riskImpact >= 31 && riskImpact <= 45) {
    return "orange";
  } else {
    return "red";
  }
}

export function buildGridSvg(data) {
  const svg = d3.create("svg");

  // Define the width and height of each square
  const squareSize = 20;
  const padding = 2;

  const w = (w) => squareSize * w;

  svg
    .selectAll(".square")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "square")
    .attr("x", (d, i) => (i % 10) * (squareSize + padding))
    .attr("y", (d, i) => Math.floor(i / 10) * (squareSize + padding))
    .attr("width", (d) => w(d.risk_impact))
    .attr("height", squareSize)
    .attr("fill", (d) => getColor(d.risk_impact));

  // Adjust the size of the SVG container based on the number of squares
  const rows = Math.ceil(data.length / 10);
  const svgWidth = 10 * (squareSize + padding);
  const svgHeight = rows * (squareSize + padding);
  svg.attr("width", svgWidth).attr("height", svgHeight);

  return svg.node();
}
