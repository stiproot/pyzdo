import * as d3 from "d3";

const percs = (d) => {
  // % of children complete
  let percChildrenCompleted = null;
  if (d.children && d.children.length > 0) {
    const completed = d.children.filter((c) => c.state === "Closed");
    const perc = (completed.length / d.children.length) * 100;
    percChildrenCompleted = `Children Complete: ${Math.floor(perc)}%`;
  }

  // % effort
  let percEffort = null;
  if ((d.completed_work && d.completed_work > 0) || d.state === "Closed") {
    percEffort = `Effort Complete: ${100}%`;
  } else {
    const numerator = d.remaining_work < 0 ? 0 : d.remaining_work;
    const denominator = d.original_estimate < 0 ? 0 : d.original_estimate;

    if (denominator === 0 || numerator === 0) {
      percEffort = `Effort Complete: ${0}%`;
    } else {
      const perc = (numerator / denominator) * 100;
      percEffort = `Effort Complete: ${Math.floor(perc)}%`;
    }
  }

  return [percChildrenCompleted, percEffort];
};

const displays = (d) => {
  const lines = [`ID: ${d.id}`, `Title: ${d.title}`];

  const percentages = percs(d);
  if (!percentages) {
    console.warn("no percentages");
  } else {
    for (const p of percentages) {
      if (p) lines.push(p);
    }
  }

  if (d.type === "Task") {
    lines.push(
      `Remaining Work: ${
        d.completed_work && d.completed_work > 0
          ? "0 hours"
          : d.remaining_work >= 0
          ? `${d.remaining_work} hours`
          : "unspecified"
      }`
    );
    lines.push(
      `Original Estimate: ${
        d.original_estimate > 0 ? `${d.original_estimate} hours` : "unspecified"
      }`
    );
  }

  lines.push(`Assigned To: ${d.assigned_to}`);
  lines.push(`State: ${d.state}`);

  d.display_lines = lines;
};

export const enrich = (n) => {
  (n.children ?? []).forEach((c) => enrich(c));

  if (n.type === "Task") {
    displays(n);
    return;
  }

  const remaining_work = n.children.reduce((acc, c) => {
    return acc + (c.remaining_work ?? 0);
  }, 0);

  n.remaining_work = remaining_work;

  const original_estimate = n.children.reduce((acc, c) => {
    return acc + (c.original_estimate ?? 0);
  }, 0);

  n.original_estimate = original_estimate;

  displays(n);
};

export function buildPackedCircleSvg(data) {
  enrich(data);

  const width = window.innerWidth;
  const height = width;

  const color = (d) => {
    if (!d) return "#ffffff";

    const type = d.data.type;
    if (type === "Task") return "#c7a148";
    if (type === "User Story") return "#0078D7";
    if (type === "Feature") return "#6d42bd";
    if (type === "Epic") return "#bd6342";
    if (type === "Initiative") return "#3439cf";
    return "#ffffff";
  };

  const pack = (data) =>
    d3.pack().size([width, height]).padding(3)(
      d3
        .hierarchy(data)
        .sum((d) => d.id)
        // .sum((d) => d.child_count)
        .sort((a, b) => b.value - a.value)
    );

  const root = pack(data);

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .attr(
      "style",
      `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: ${color(
        0
      )}; cursor: pointer;`
    );

  // Append the nodes.
  const node = svg
    .append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
    //.attr("fill", (d) => (d.children ? color(d.depth) : "white"))
    .attr("fill", (d) => color(d))
    .attr("pointer-events", (d) => (!d.children ? "none" : null))
    .on("mouseover", function () {
      d3.select(this).attr("stroke", "#000");
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke", null);
    })
    .on(
      "click",
      (event, d) => focus !== d && (zoom(event, d), event.stopPropagation())
    );

  // const perc = (d) => {
  //   if (
  //     (d.data.completed_work && d.data.completed_work > 0) ||
  //     d.data.state === "Closed"
  //   )
  //     return 100;
  //   const numerator = d.data.remaining_work < 0 ? 0 : d.data.remaining_work;
  //   const denominator =
  //     d.data.original_estimate < 0 ? 0 : d.data.original_estimate;

  //   if (denominator === 0 || numerator === 0) return 0;

  //   const perc = (numerator / denominator) * 100;
  //   return perc;
  // };

  // const textRows = (d) => {
  //   const percentageComplete = `Complete: ${Math.floor(perc(d))}%`;

  //   const lines = [`ID: ${d.data.id}`, `Title: ${d.data.title}`];
  //   if (percentageComplete) lines.push(percentageComplete);

  //   if (d.data.type === "Task") {
  //     lines.push(
  //       `Remaining Work: ${
  //         d.data.completed_work && d.data.completed_work > 0
  //           ? "0 hours"
  //           : d.data.remaining_work >= 0
  //           ? `${d.data.remaining_work} hours`
  //           : "unspecified"
  //       }`
  //     );
  //     lines.push(
  //       `Original Estimate: ${
  //         d.data.original_estimate > 0
  //           ? `${d.data.original_estimate} hours`
  //           : "unspecified"
  //       }`
  //     );
  //   }

  //   lines.push(d.data.assigned_to);
  //   // lines.push(riskImpact);

  //   return lines;
  // };

  // Append the text labels.
  const label = svg
    .append("g")
    .style("font", "15px sans-serif")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
    .style("display", (d) => (d.parent === root ? "inline" : "none"))
    // .text((d) => d.data.title + "\n" + d.data.type)
    .each(function (d) {
      const textLines = d.data.display_lines;
      const text = d3.select(this);

      text
        .selectAll("tspan")
        .data(textLines.filter(Boolean)) // Filter out empty lines
        .join("tspan")
        .attr("x", 0)
        .attr("y", (line, i) => i * 1.1 + "em") // Adjust spacing between lines
        .text((line) => line);
    });

  // Create the zoom behavior and zoom immediately in to the initial focus node.
  svg.on("click", (event) => zoom(event, root));
  let focus = root;
  let view;
  zoomTo([focus.x, focus.y, focus.r * 2]);

  function zoomTo(v) {
    const k = width / v[2];

    view = v;

    label.attr(
      "transform",
      (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
    );
    node.attr(
      "transform",
      (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
    );
    node.attr("r", (d) => d.r * k);
  }

  function zoom(event, d) {
    focus = d;

    const transition = svg
      .transition()
      .duration(event.altKey ? 7500 : 750)
      .tween("zoom", () => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return (t) => zoomTo(i(t));
      });

    label
      .filter(function (d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .transition(transition)
      .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
      .on("start", function (d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  }

  return svg.node();
}
