export function addLegendElement(
  selection,
  text,
  color,
  transitionTime,
  width,
  height,
  dash
) {
  selection
    .append('line')
    .attr('x1', width * 0.1)
    .attr('y1', height * 0.55)
    .attr('x2', width * 0.5)
    .attr('y2', height * 0.55)
    .attr('stroke', color)
    .attr('stroke-dasharray', dash)
    .attr('stroke-width', 3)
    .attr('opacity', 0)
    .transition()
    .duration(transitionTime)
    .attr('opacity', 1);
  selection
    .append('text')
    .attr('x', width * 0.55)
    .attr('y', height * 0.5)
    .attr('dy', '0.35em')
    .text(text)
    .attr('fill', color)
    .attr('opacity', 0)
    .transition()
    .duration(transitionTime)
    .attr('opacity', 1);
}