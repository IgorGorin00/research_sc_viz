import * as d3 from "d3";
export function roundValue(x) {
	return Math.floor(x / Math.pow(10, Math.floor(Math.log10(x)) - 1)) * Math.pow(10, Math.floor(Math.log10(x)) - 1)
}

export function linspace(start, stop, num) {
  if (num === 1) {
    return [start];
  }
  const step = (stop - start) / (num - 1);
  const result = [];
  
  for (let i = 0; i < num; i++) {
    const value = start + step * i;
    result.push(value);
  } 
  return result;
}


export function transition(path, timePeriod) {
  path
    .transition()
    .duration(timePeriod)
    .attrTween('stroke-dasharray', function () {
      var len = this.getTotalLength();
      return function (t) {
        return d3.interpolateString(
          '0,' + len,
          len + ',' + len
        )(t);
      };
    });
}

export function findMaxValue(arr) {
  let max = 0;
  for(let i = 0; i < arr.length; i++) {
      if(arr[i].observed > max) {
          max = arr[i].observed;
      }
      if(arr[i].synthetic > max) {
          max = arr[i].synthetic;
      }
  }
  return max;
}
export function preprocessData(data) {
  const dates = Object.values(data['year']);
  const dataObserved = Object.values(
    data['Observed']
  );
  const dataSynthetic = Object.values(
    data['Synthetic']
  );
  const parseYear = d3.timeParse('%Y');
  const datesNew = dates.map((d) =>
    parseYear(d)
  );
  const dataNew = dates.map((date, i) => ({
    year: date,
    observed: dataObserved[i],
    synthetic: dataSynthetic[i],
  }));
  return dataNew
}