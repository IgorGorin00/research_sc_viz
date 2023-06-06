import * as d3 from "d3";
import { vizualize, vizualizeBar } from "/js/vizualize";
import { getData, getDataForBarplot } from "/js/getData";
import {
  margin,
  marginPlacebo,
  colors,
  transitionTime1,
  transitionTime2,
} from "/js/globalConstants";
import { addLegendElement } from "./legend";


export function renderLines(countryName, regionName, data, treatmentYear) {
  const container = document.querySelector(".grid-container > :nth-child(1)");

  const { width, height } = container.getBoundingClientRect();
  const gridElements = getData(countryName, regionName, data);
  const gridItems = document.querySelectorAll(".grid-item");
  gridElements.forEach((element, i) => {
    const gItem = d3
      .select(gridItems[i])
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");
    gItem.call(
      vizualize,
      countryName,
      treatmentYear,
      element.data,
      element.title,
      element.maxYValue,
      element.nItems,
      colors["synth"],
      colors["observed"],
      transitionTime1,
      transitionTime2,
      width,
      height,
      margin
    );
  });
}

export function renderLegend(placebo) {
  const legendContainer = document.querySelector(
    ".legend-container > :nth-child(1)"
  );

  const legendWidth = legendContainer.getBoundingClientRect()["width"];
  const legendHeight = legendContainer.getBoundingClientRect()["height"];

  const legendElements = [
    {
      text: placebo ? "Treated" : "Observed",
      color: placebo ? colors["treated"] : colors["observed"],
      dashed: null,
    },
    {
      text: placebo ? "Placebo" : "Synthetic",
      color: placebo ? colors["placebo"] : colors["synth"],
      dashed: null,
    },
    {
      text: "SEZ creation",
      color: colors["treatment"],
      dashed: "15 5",
    },
  ];

  const legendItems = document.querySelectorAll(".legend-item");
  legendElements.forEach((element, i) => {
    const legendItem = legendItems[i]
    if (!legendItem) return;
    const lItem = d3
      .select(legendItem)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [0, 0, legendWidth, legendHeight])
      .attr("preserveAspectRatio", "xMidYMid meet");

    lItem.call(
      addLegendElement,
      element.text,
      element.color,
      transitionTime2,
      legendWidth,
      legendHeight,
      element.dashed
    );
  });
}

export function renderBar(data, countryName) {
  const container = document.querySelector(".grid-container > :nth-child(1)");
  const { width, height } = container.getBoundingClientRect();
  const gridElements = getDataForBarplot(data, countryName)
  const gridItems = document.querySelectorAll(".grid-item");
  gridElements.forEach((element, i) => {
    const gItem = d3
      .select(gridItems[i])
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");
    gItem.call(
      vizualizeBar,
      element.data,
      element.maxYValue,
      element.title,
      element.placeboGroup,
      transitionTime1,
      transitionTime2,
      colors["treated"],
      colors["placebo"],
      width,
      height,
      marginPlacebo,
    );
  });





}