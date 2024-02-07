import * as d3 from "d3";

// function getColor(riskImpact) {
//   if (riskImpact >= 0 && riskImpact <= 30) {
//     return "green";
//   } else if (riskImpact >= 31 && riskImpact <= 45) {
//     return "orange";
//   } else {
//     return "red";
//   }
// }

// export function buildMldlcSvg(data) {

//   console.log(data);

//   const margin = { top: 200, right: 200, bottom: 200, left: 200 };
//   const width = 400 - margin.left - margin.right;
//   const height = 400 - margin.top - margin.bottom;

//   const svg = d3.create("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   // const buffer = 5; // Buffer size between squares

//   // Create the base square
//   svg.append("rect")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("width", width)
//     .attr("height", height)
//     .attr("fill", "grey");

//   // Function to create nested squares recursively

//   // createNestedSquares(svg, 0, 0, width, 2, buffer); // Create two levels of nested squares

//   return svg.node();
// }

// function createNestedSquares(svg, x, y, width, depth, buffer) {
//   if (depth > 0) {
//     const childWidth = width / 2;
//     const childHeight = childWidth;

//     for (let i = 0; i < 2; i++) {
//       for (let j = 0; j < 2; j++) {
//         const childX = x + i * (childWidth + buffer);
//         const childY = y + j * (childHeight + buffer);

//         svg.append("rect")
//           .attr("x", childX)
//           .attr("y", childY)
//           .attr("width", childWidth)
//           .attr("height", childHeight)
//           .attr("fill", depth === 1 ? "blue" : "green"); // Color based on depth

//         createNestedSquares(childX, childY, childWidth, depth - 1);
//       }
//     }
//   }
// }

export function buildMldlcSvgBeta(data) {

  console.log(data);

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = windowWidth - margin.left - margin.right;
  const height = windowHeight - margin.top - margin.bottom;
  // const buffer = 5;

  const svgWidth = width;
  const svgHeight = height;

  const svg = d3.create("svg")
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // Main Rectangle
  const mainRectWidth = 1000;
  const mainRectHeight = 500;

  svg.append('rect')
    .attr('x', (svgWidth - mainRectWidth) / 2)
    .attr('y', (svgHeight - mainRectHeight) / 2)
    .attr('width', mainRectWidth)
    .attr('height', mainRectHeight);

  // Sub-Rectangles
  const subRectWidth = 100;
  const subRectHeight = 50;

  // Top-left sub-rectangle
  svg.append('rect')
    .attr('x', (svgWidth - mainRectWidth) / 2)
    .attr('y', (svgHeight - mainRectHeight) / 2)
    .attr('width', mainRectWidth / 2)
    .attr('height', mainRectHeight / 2)
    .attr("fill", "lightgray");

  // Top-right sub-rectangle
  svg.append('rect')
    .attr('x', (svgWidth + mainRectWidth) / 2 - subRectWidth)
    .attr('y', (svgHeight - mainRectHeight) / 2)
    .attr('width', subRectWidth)
    .attr('height', subRectHeight)
    .attr("fill", "blue");

  // Bottom-left sub-rectangle
  svg.append('rect')
    .attr('x', (svgWidth - mainRectWidth) / 2)
    .attr('y', (svgHeight + mainRectHeight) / 2 - subRectHeight)
    .attr('width', subRectWidth)
    .attr('height', subRectHeight)
    .attr("fill", "blue");

  // Bottom-right sub-rectangle
  svg.append('rect')
    .attr('x', (svgWidth + mainRectWidth) / 2 - subRectWidth)
    .attr('y', (svgHeight + mainRectHeight) / 2 - subRectHeight)
    .attr('width', subRectWidth)
    .attr('height', subRectHeight)
    .attr("fill", "blue");

  return svg.node();
}