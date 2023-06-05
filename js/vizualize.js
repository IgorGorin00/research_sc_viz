import * as d3 from "d3";
import { addBackgroundGrid, getXAxis, getYAxis, getTitle } from "./graphLayout";
import { getTreatmentLine, getLine, getBar } from "./graphLines";


export function vizualize(
  selection,
  countryName,
  treatmentYear,
  data,
  graphTitle,
  maxYValue,
  nItems,
  colorSynth,
  colorObserved,
  transitionTime1,
  transitionTime2,
  width,
  height,
  margin
) {
  const placebo = false;
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.year))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxYValue * 1.05])
    .range([height - margin.bottom, margin.top]);
  selection.call(addBackgroundGrid, xScale, yScale);
  selection.call(getTitle, graphTitle, transitionTime2, width, margin);

  // Add the vertical dashed line

  selection.call(
    getTreatmentLine,
    treatmentYear,
    transitionTime1,
    xScale,
    yScale
  );

  selection.call(
    getLine,
    data,
    false, // indicates that it is observed values
    colorSynth,
    colorObserved,
    transitionTime1,
    xScale,
    yScale,
    margin
  );
  selection.call(
    getLine,
    data,
    true, // indicates that it is synthetic values
    colorSynth,
    colorObserved,
    transitionTime1,
    xScale,
    yScale,
    margin
  );

  selection.call(getXAxis, height, margin, xScale, transitionTime2, placebo);

  // Add y-axis
  selection.call(
    getYAxis,
    countryName,
    graphTitle,
    nItems,
    maxYValue,
    margin,
    yScale,
    transitionTime2
  );
}

export function vizualizeBar(
  selection,
  data,
  maxYValue,
  title,
  placeboGroup,
  transitionTime1,
  transitionTime2,
  colorTreatment,
  colorPlacebo,
  width,
  height,
  margin
) {
  const placebo = true;
  const countryName = "placebo";
  const nItems = 3;
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.region))
    .range([margin.left, width - margin.right])
    .padding(0.1);
  const yScale = d3
    .scaleLinear()
    .domain([0, maxYValue * 1.05])
    .range([height - margin.bottom, margin.top]);
  selection.call(getXAxis, height, margin, xScale, transitionTime2, placebo);

  selection.call(
    getYAxis,
    countryName,
    null,
    nItems,
    maxYValue,
    margin,
    yScale,
    transitionTime2
  );

  selection.call(getTitle, title, transitionTime2, width, margin);
  selection.call(getBar, data, placeboGroup, xScale, yScale, transitionTime1, colorTreatment, colorPlacebo);
}
