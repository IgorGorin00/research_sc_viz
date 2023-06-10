import * as d3 from "d3";
import { transition } from "./utils";

export function getTreatmentLine(
    selection,
    treatmentYear,
    transitionTime,
    xScale,
    yScale
) {
    const y1 = yScale(yScale.domain()[1]);
    const y2 = yScale(0);
    selection
        .append("line")
        .attr("x1", xScale(treatmentYear) + xScale.bandwidth() / 2)
        .attr("y1", y1)
        .attr("x2", xScale(treatmentYear) + xScale.bandwidth() / 2)
        .attr("y2", y2)
        .classed("line-dashed", true)
        .attr("opacity", 0)
        .transition()
        .duration(transitionTime)
        .attr("opacity", 1);
}

export function getLine(
    selection,
    data,
    synth,
    colorSynth,
    colorObserved,
    transitionTime,
    xScale,
    yScale,
    margin
) {
    if (!synth) {
        const line = d3
            .line()
            .x((d) => {
                return xScale(d.year) + xScale.bandwidth() / 2;
            })
            .y((d) => {
                return yScale(d.observed);
            });

        selection
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", colorObserved)
            .attr("stroke-width", 3)
            .attr("d", line)
            .call(transition, transitionTime);
    } else {
        const xPixelValues = [];
        const yPixelValues = [];

        const xValues = [];
        const yValuesObserved = [];
        const yValuesSynthetic = [];

        const line = d3
            .line()
            .x((d) => {
                const pixelValue = xScale(d.year) + xScale.bandwidth() / 2;
                xPixelValues.push(pixelValue);
                xValues.push(d.year);
                return pixelValue;
            })
            .y((d) => {
                const pixelValue = yScale(d.synthetic);
                yPixelValues.push(pixelValue);
                yValuesSynthetic.push(d.synthetic);
                yValuesObserved.push(d.observed);
                return pixelValue;
            });

        selection
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", colorSynth)
            .attr("stroke-width", 3)
            .attr("d", line)
            .call(transition, transitionTime);

        const hoverLineX = selection
            .append("line")
            .attr("stroke", "gray")
            .attr("stroke-dasharray", "3,3")
            .style("opacity", 0);

        const hoverLineY = selection
            .append("line")
            .attr("stroke", "gray")
            .attr("stroke-dasharray", "3,3")
            .style("opacity", 0);

        const toolTipCircle = selection
            .append("circle")
            .attr("stroke", "gray")
            .attr("fill", "none")
            .style("opactity", 0);

        const wW = window.innerWidth
        const rectWidth = wW > 600 ? wW * 0.11 : wW * 0.4;
        const rectHeight = window.innerHeight * 0.07;

        const tooltip = selection.append("g");

        const toolTipRect = tooltip
            .append("rect")
            .attr("rx", 5)
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("fill", "#290c41")
            .attr("width", rectWidth)
            .attr("height", rectHeight);

        const toolTipText1 = tooltip
            .append("text")
            .attr("x", rectWidth * 0.05 + margin.left)
            .attr("y", rectHeight * 0.3 + margin.top)
            .text(`Year: ${Math.floor(xValues[0])}`)
            .attr("fill", "#d3d3d3")
            .attr("font-size", rectHeight * 0.3);

        const toolTipText2 = tooltip
            .append("text")
            .attr("x", rectWidth * 0.05 + margin.left)
            .attr("y", rectHeight * 0.6 + margin.top)
            .text(`Observed: ${Math.floor(yValuesSynthetic[0])}`)
            .attr("fill", colorObserved)
            .attr("font-size", rectHeight * 0.3);

        const toolTipText3 = tooltip
            .append("text")
            .attr("x", rectWidth * 0.05 + margin.left)
            .attr("y", rectHeight * 0.9 + margin.top)
            .text(`Synthetic: ${Math.floor(yValuesSynthetic[0])}`)
            .attr("fill", colorSynth)
            .attr("font-size", rectHeight * 0.3);
        tooltip.style("opacity", 0);

        selection
            .on("mousemove", function (event) {
                const mx = d3.pointer(event, this)[0];

                const x0 =
                    Math.round((mx - margin.left) / xScale.step()) * xScale.step();

                const hoverYear = xScale.domain()[Math.round(x0 / xScale.step())];
                const idx = xValues.indexOf(hoverYear);
                const hoverValue = yValuesSynthetic[idx];

                if (hoverYear === undefined || hoverValue === undefined) {
                    hoverLineX.style("opacity", 0);
                    hoverLineY.style("opacity", 0);
                    toolTipCircle.style("opacity", 0);
                    tooltip.style("opacity", 0);
                } else {
                    hoverLineX
                        .attr("x1", xScale(hoverYear) + xScale.bandwidth() / 2)
                        .attr("x2", xScale(hoverYear) + xScale.bandwidth() / 2)
                        .attr("y1", yScale.range()[0])
                        .attr("y2", yScale.range()[1])
                        .style("opacity", 1);

                    hoverLineY
                        .attr("y1", yScale(hoverValue))
                        .attr("y2", yScale(hoverValue))
                        .attr("x1", xScale.range()[0] + xScale.bandwidth() / 2)
                        .attr("x2", xScale.range()[1] + xScale.bandwidth() / 2)
                        .style("opacity", 1);

                    toolTipCircle
                        .attr("cx", xScale(hoverYear) + xScale.bandwidth() / 2)
                        .attr("cy", yScale(hoverValue))
                        .attr("r", "6px")
                        .style("opacity", 1);
                    toolTipText1.text(`Year: ${hoverYear}`);
                    toolTipText2.text(`Observed: ${Math.floor(yValuesObserved[idx])}`);
                    toolTipText3.text(`Synthetic: ${Math.floor(yValuesSynthetic[idx])}`);
                    tooltip.style("opacity", 1);
                }
            })
            .on("mouseout", function () {
                hoverLineX.style("opacity", 0);
                hoverLineY.style("opacity", 0);
                toolTipCircle.style("opacity", 0);
                tooltip.style("opacity", 0);
            });
    }
}

export function getBar(
    selection,
    data,
    placeboGroup,
    xScale,
    yScale,
    transitionTime,
    colorTreatment,
    colorPlacebo,
    margin
) {
    selection
        .append("g")
        .selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.region))
        .attr("y", yScale(0))
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", "#140620")
        .attr("class", "data-bar");

    selection
        .selectAll(".data-bar")
        .transition()
        .duration(transitionTime)
        .attr("y", (d) => yScale(d.value))
        .attr("height", (d) => yScale(0) - yScale(d.value))
        .attr("fill", (d) =>
            placeboGroup.includes(d.region) ? colorPlacebo : colorTreatment
        )
        .delay((d, i) => i * 100);

    const rectWidth = xScale.bandwidth(); //* 1.1;
    const rectHeight = selection.node().getBoundingClientRect().width * 0.05;
    const tooltip = selection.append("g");
    const toolTipRect = tooltip
        .append("rect")
        .attr("rx", 5)
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("fill", "#290c41")
        .attr("width", rectWidth)
        .attr("height", rectHeight);
    tooltip.style("opacity", 0);
    const toolTipText = tooltip
        .append("text")
        .attr("x", rectWidth * 0.05 + margin.left)
        .attr("y", rectHeight * 0.3 + margin.top)
        .text("")
        .attr("fill", "#d3d3d3")
        .attr("font-size", rectHeight * 0.55);
    selection
        .selectAll(".data-bar")
        .on("mouseover", function (event, d) {
            let yVal = yScale(d.value) - (rectHeight + 10);
            if (yVal < margin.top) {
                yVal = margin.top;
            }
            toolTipRect        
                .attr("x", xScale(d.region))
                .attr("y", yVal);

            toolTipText
                .attr("x", xScale(d.region) + rectWidth * 0.1)
                .attr("y", yVal + rectHeight * 0.5 + 5)
                .text(d.value.toFixed(2));
            tooltip.style("opacity", 1);
        })
        .on("mouseout", function () {
            tooltip.style("opacity", 0);
        });
}
