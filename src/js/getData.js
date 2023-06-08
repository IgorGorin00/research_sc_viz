import { findMaxValue, preprocessData } from "./utils";
import { graphTitles } from "/js/globalConstants";
export function getData(countryName, regionName, data) {
  const variablesPerContry = {
    india: ["grp", "industry", "investments", "fixed_assets"],
    russia: ["grp", "industry", "investments", "fixed_assets"],
    brazil: ["grp", "industry", "export"],
  };

  const variableNames = variablesPerContry[countryName];

  const nItems = 7;
  const gridElements = [];
  for (let varName of variableNames) {
    let dataNew = preprocessData(
      data["treated"][regionName][varName]["res_df"]
    );
    if (countryName === "brazil" && varName == "grp") {
      dataNew = dataNew.slice(5);
    }
    const maxYvalue = findMaxValue(dataNew);
    const title = graphTitles[varName];
    const obj = {
      data: dataNew,
      title: title,
      maxYValue: maxYvalue,
      nItems: nItems,
    };
    gridElements.push(obj);
  }
  return gridElements;
}

export function getDataForBarplot(data, countryName) {
  const variablesPerContry = {
    india: ["grp", "investments", "fixed_assets"],
    russia: ["grp", "industry", "investments"],
    brazil: ["grp", "industry", "export"],
  };

  const gridElements = new Array();
  variablesPerContry[countryName].forEach((varName) => {
    const dataNew = new Array();
    let maxYValue = 0;
    const skip = ["voronezh region", "oryol region"];
    const placeboGroup = new Array();
    Object.keys(data).forEach((synthGroup) => {
      Object.keys(data[synthGroup]).forEach((rName) => {
        if (!skip.includes(rName)) {
          const value = data[synthGroup][rName][varName]["rel"];
          if (value > maxYValue) {
            maxYValue = value;
          }
          if (synthGroup === "placebo") {
            placeboGroup.push(rName);
          }
          dataNew.push({ region: rName, value: value });
        }
      });
    });
    const obj = {
      data: dataNew,
      maxYValue: maxYValue,
      title: graphTitles[varName],
      placeboGroup: placeboGroup,
    };
    gridElements.push(obj);
  });
  return gridElements;
}
