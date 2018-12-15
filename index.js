// Fetch the data from a remote point
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
const HHMMformat = d3.timeFormat("%H:%M");

// create graph //

// chart styles
const chartStyles = {
  margin: {
    top: 60,
    right: 30,
    bottom: 30,
    left: 50
  }
};

// Create SVG element
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

let svg = d3
  .select(".svgWrapper")
  .append("svg")
  .attr("width", svgStyles.w)
  .attr("height", svgStyles.h);

// Add title element
let title = svg
  .append("text")
  .attr("x", svgStyles.w / 2)
  .attr("y", chartStyles.margin.top / 2 - 5)
  .attr("text-anchor", "middle")
  .attr("id", "title")
  .style("font-size", "24px")
  //   .style("font-family", "Roboto")
  .text("Doping in Professional Bicycle Racing");

// Add subtitle element
let subtitle = svg
  .append("text")
  .attr("x", svgStyles.w / 2)
  .attr("y", chartStyles.margin.top / 2 + 20)
  .attr("text-anchor", "middle")
  .attr("id", "subtitle")
  .style("font-size", "16px")
  //   .style("font-family", "Roboto")
  .text("35 Fastest times up Alpe dHuez");

// Add chart to svg
let chart = svg
  .append("g")
  .attr("class", "chart")
  .attr(
    "transform",
    `translate(${chartStyles.margin.left}, ${chartStyles.margin.top})`
  );

// Add remote data to graph
function loadData(data) {
  // X AXIS
  // Scaling function
  const xScale = d3
    .scaleTime()
    .range([0, chartStyles.w])
    .domain([
      d3.min(data, d => new Date().setFullYear(d.Year)),
      d3.max(data, d => new Date().setFullYear(d.Year))
    ]);

  // create X axis
  chart
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${chartStyles.h})`)
    .call(d3.axisBottom(xScale));

// Y AXIS
  // Scaling function
  const yScale = d3
    .scaleTime()
    .range([chartStyles.h , 0])
    .domain([
      d3.min(data, d => setHHMM(d.Time)),
      d3.max(data, d => setHHMM(d.Time))
    ]);

  // create Y axis
  chart
    .append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale));

}


/*
@ param hhmm {string} must be a string representing a time in the format hh:mm
returns a date object given the passed hours and minutes values
*/
function setHHMM(hhmm) {
    
    ( [hh , mm] = [ hhmm.split(':')[0] , hhmm.split(':')[1] ] );

    return new Date().setHours(hh, mm);
}