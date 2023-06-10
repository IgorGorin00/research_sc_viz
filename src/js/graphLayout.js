import * as d3 from "d3";
import {
  transition,
  roundValue,
  linspace,
} from './utils';

export function addBackgroundGrid(
  selection,
  xScale,
  yScale
) {
  const yMinValue = yScale(yScale.domain()[0]);
  const yMaxValue = yScale(yScale.domain()[1]);
  const xMinValue = xScale(xScale.domain()[0]);
  const xMaxValue = xScale(
    xScale.domain()[xScale.domain().length - 1]
  );
  const yValues = linspace(
    yMinValue,
    yMaxValue,
    10
  );
  const xValues = linspace(
    xMinValue,
    xMaxValue,
    10
  );
  selection
    .append('g')
    .selectAll('line')
    .data(yValues)
    .join('line')
    .attr('x1', xMinValue)
    .attr('y1', (d) => d)
    .attr('x2', xMaxValue)
    .attr('y2', (d) => d)
    .attr('stroke', 'black')
    .attr('stroke-width', 1);

  selection
    .append('g')
    .selectAll('line')
    .data(xValues)
    .join('line')
    .attr('x1', (d) => d)
    .attr('y1', yMinValue)
    .attr('x2', (d) => d)
    .attr('y2', yMaxValue)
    .attr('stroke', 'black')
    .attr('stroke-width', 1);
}

export function getYAxis(
  selection,
  countryName,
  graphTitle,
  nItems,
  maxYValue,
  margin,
  yScale,
  transitionTime

) {
  let yLabels = linspace(
    0,
    maxYValue,
    nItems
  ).map((x) => roundValue(x));
  // yLabels[0] = yLabels[1] / 2;
  const convertCurrency = {
    india: (d) => d * 0.012 / 10 + "M",
    russia: (d) => d * 0.012 + "M",
    brazil: (d) => graphTitle.includes('Export') ? d / 1000000 + "M" : d * 0.2 + "M",
    placebo: (d) => Number(d.toFixed(2))
  }
  yLabels = yLabels.slice(1);
  selection
    .append('g')
    .attr('class', 'y-axis')
    .attr(
      'transform',
      `translate(${margin.left},0)`
    )
    .call(
      d3
        .axisLeft(yScale)
        .tickValues(yLabels)
        .tickFormat(convertCurrency[countryName])
    )
    .selectAll('.tick text')
    .classed('axis-label', true)
    .attr('opacity', 0)
    .transition()
    .duration(transitionTime)
    .attr('opacity', 1);

  selection
    .select('.y-axis path')
    .classed('grid-line', true)
    .call(transition, transitionTime);
}



export function getXAxis(
  selection,
  height,
  margin,
  xScale,
  transitionTime,
  placebo
) {
  const showEvery = placebo ? 1 : 2
  const rotation = placebo ? -30 : 0
  const dx = placebo ? '-1.8em' : '0'
  const dy = placebo ? '1.5em' : '1em'
  selection
    .append('g')
    .attr('class', 'x-axis')
    .attr(
      'transform',
      `translate(0,${height - margin.bottom})`
    )
    .call(
      d3
        .axisBottom(xScale)
        .tickValues(
          xScale
            .domain()
            .filter((d, i) => i % showEvery === 0)
        )
    )
    .selectAll('text')
    .classed('axis-label', true)
    .attr('dx', dx)
    .attr('dy', dy)
    .attr('transform', `rotate(${rotation})`)
    .attr('opacity', 0)
    .transition()
    .duration(transitionTime)
    .attr('opacity', 1);
  selection
    .select('.x-axis path')
    .classed('grid-line', true)
    .call(transition, transitionTime);
}

export function getTitle(
  selection,
  title,
  transitionTime,
  width,
  margin
) {
  selection
    .append('text')
    .attr('x', width * 0.5)
    .attr('y', margin.top * 0.5)
    .attr('dy', '0.3em')
    .attr('text-anchor', 'middle')
    .classed('graph-title', true)
    .text(title)
    .attr('opacity', 0)
    .transition()
    .duration(transitionTime)
    .attr('opacity', 1);
}
