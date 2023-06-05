import * as d3 from "d3";
import { renderLines, renderLegend, renderBar } from "/js/render";

export function main(path) {
  const pathParts = path.split("/");
  console.log(pathParts)
  let regionName = pathParts[pathParts.length - 1].replace("_", " ");

  const slugificationBullshit = {
    ceara: "ceará",
    piaui: "piauí",
  };
  if (Object.keys(slugificationBullshit).includes(regionName)) {
    regionName = slugificationBullshit[regionName];
  }
  const titleWords = regionName
    .split(" ")
    .map((d) => d[0].toUpperCase() + d.substr(1))
    .join(" ");
  const countryName = pathParts[pathParts.length - 2];

  document.getElementById("title").innerHTML =
    countryName === "russia" || titleWords === "Placebo" ? titleWords : `${titleWords} state`;
  const dataFiles = {
    india: "/data/result_in.json",
    russia: "/data/result_ru.json",
    brazil: "/data/result_br.json",
  };

  const fileName = dataFiles[countryName];

  if (!fileName) {
    throw new Error("Invalid country name");
  }

  d3.json(fileName)
    .then((data) => {
      if (regionName !== "placebo") {
        const treatmentYear = data["treated"][regionName]["treatment_year"];
        console.log(treatmentYear)
        const placebo = false;
        renderLines(countryName, regionName, data, treatmentYear);
        renderLegend(placebo);
      } else {
        //[...document.getElementsByClassName("legend-container")].map(n => n && n.remove())
        const placebo = true
        const containter = document.querySelector(".legend-container");
        containter.lastElementChild.remove();
        renderBar(data, countryName);
        renderLegend(placebo)
      }
    })
    .catch((error) => console.error(error));
}
