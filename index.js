// Fetch the data from a remote point
let req, json;
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
req = new XMLHttpRequest();
req.open("GET", url, true);
req.onload = () => {
  json = JSON.parse(req.responseText);
  loadData(json);
};
req.send();

// settings
const MMSSformat = d3.timeFormat("%M:%S");

// Styles //

const chartStyles = {
  margin: {
    top: 60,
    right: 30,
    bottom: 30,
    left: 70
  }
};

const svgStyles = {
  w: 800,
  h: 500,
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }
};

chartStyles.w =
  svgStyles.w - chartStyles.margin.left - chartStyles.margin.right;
chartStyles.h =
  svgStyles.h - chartStyles.margin.top - chartStyles.margin.bottom;

let tooltipStyles = {
  maxWidth: 100
};

// Create graph

let svg = d3
  .select(".svgWrapper")
  .append("svg")
  .attr("width", svgStyles.w)
  .attr("height", svgStyles.h);

// define title
svg
  .append("text")
  .attr("x", svgStyles.w / 2)
  .attr("y", chartStyles.margin.top / 2 - 5)
  .attr("text-anchor", "middle")
  .attr("id", "title")
  .style("font-size", "24px")
  .text("Doping in Professional Bicycle Racing");

// define subtitle
svg
  .append("text")
  .attr("x", svgStyles.w / 2)
  .attr("y", chartStyles.margin.top / 2 + 20)
  .attr("text-anchor", "middle")
  .attr("id", "subtitle")
  .style("font-size", "16px")
  .text("35 Fastest times up Alpe dHuez");

// define Y axis title
svg
  .append("text")
  .attr("x", -(chartStyles.w / 2.5))
  .attr("y", chartStyles.margin.top / 2.4)
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .text("Time in minutes");

let legend = svg
  .append("g")
  .attr("class", "legend")
  .attr("id", "legend")
  .attr("transform", `translate(${chartStyles.w + 40}, ${svgStyles.h / 2})`);

legend
  .append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("text-anchor", "end")
  .text("No doping allegations");

legend
  .append("text")
  .attr("x", 0)
  .attr("y", "1.5rem")
  .attr("text-anchor", "end")
  .text("Riders with doping allegations");

legend
  .append("rect")
  .attr("x", 5)
  .attr("y", "-0.8rem")
  .attr("class", "no-doping");

legend
  .append("rect")
  .attr("x", 5)
  .attr("y", "0.8rem")
  .attr("class", "doping");

// Add chart to svg
let chart = svg
  .append("g")
  .attr("class", "chart")
  .attr(
    "transform",
    `translate(${chartStyles.margin.left}, ${chartStyles.margin.top})`
  );

// Add remote data and build axes and graph
function loadData(data) {
  // X AXIS
  const xScale = d3
    .scaleTime()
    .range([0, chartStyles.w])
    .domain([
      d3.min(data, d => new Date().setFullYear(d.Year - 2)),
      d3.max(data, d => new Date().setFullYear(d.Year))
    ]);

  // create X axis
  chart
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${chartStyles.h})`)
    .call(d3.axisBottom(xScale));

  // Y AXIS
  const yScale = d3
    .scaleTime()
    .range([0, chartStyles.h])
    .domain([
      d3.min(data, d => setMMSS(d.Time)),
      d3.max(data, d => setMMSS(d.Time))
    ]);

  // create Y axis
  chart
    .append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale).tickFormat(MMSSformat));

  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("max-width", tooltipStyles.maxWidth);

  // draw data
  chart
    .selectAll()
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(new Date().setFullYear(d.Year - 1)))
    .attr("cy", d => yScale(setMMSS(d.Time)))
    .attr("r", 6)
    .attr("stroke", "black")
    .attr("class", d => (d.Doping ? "dot doping" : "dot no-doping"))
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => {
      let timelapse = setMMSS(d.Time);
      let date = new Date(timelapse);
      return date.toISOString();
    })
    .on("mouseover", function(d) {
      tooltip
        .style("opacity", 0.8)
        .html(
          `${d.Name}: ${d.Nationality}<br/>Year: ${d.Year}, Time: ${
            d.Time
          }<br /><br />${d.Doping}`
        )
        .style("left", function() {
          if (
            event.clientX + tooltipStyles.maxWidth <
            document.documentElement.clientWidth
          ) {
            return `${event.clientX + 5}px`;
          } else {
            return `${event.clientX - tooltipStyles.maxWidth}px`;
          }
        })
        .style("top", `${event.clientY - 20}px`)
        .attr("data-year", event.target.dataset.xvalue);
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
    });
}

/*
@ param mmss {string} must be a string representing a time in the format mm:ss
returns a date object given the passed minutes and seconds values
*/
function setMMSS(mmss) {
  let [mm, ss] = [mmss.split(":")[0], mmss.split(":")[1]];

  return new Date().setHours(0, mm, ss);
}
