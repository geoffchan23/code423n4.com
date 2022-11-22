import React from "react";
import Chart from "react-apexcharts";
import "./charts.css";

interface TimeStampsData {
  H: string[];
  M: string[];
  QA: string[];
  Gas: string[];
}

const Graph: React.FC<{
  total?: number;
  unique?: number;
  type: string;
  timeStamps?: TimeStampsData;
  startTime?: string;
  endTime?: string;
}> = ({ total, unique, type, timeStamps, startTime, endTime }) => {
  let options;
  let series;
  if (unique && total) {
    options = {
      plotOptions: {
        radialBar: {
          startAngle: -100,
          endAngle: 100,
          hollow: {
            margin: 0,
            size: "80%",
            background: "transparent",
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            dropShadow: {
              enabled: false,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.0,
            },
          },
          track: {
            background: "rgba(255, 255, 255, 0.1)",
            strokeWidth: "100%",
            margin: 0,
            startAngle: -100,
            endAngle: 100,
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35,
            },
          },
          dataLabels: {
            showOn: "always",
            name: {
              offsetY: 10,
              show: true,
              color: "#fafafa",
              fontSize: "50px",
            },
            value: {
              formatter: function (val) {
                return `${val}%`;
              },
              color: "#fafafa",
              fontSize: "40px",
              show: false,
            },
          },
        },
      },
      fill: {
        colors: ["#5FFFC5"],
      },
      stroke: {
        lineCap: "round",
      },
      // labels: [`${displayTotal.toString()} %`]
      labels: [`${unique.toString()}`],
    };
    series = [Math.round((unique / total) * 100)];
  } else if (timeStamps) {
    let allTimeStamps = [];
    for (const [_, value] of Object.entries(timeStamps)) {
      value.forEach((date: string) => {
        //@ts-ignore
        allTimeStamps.push(new Date(date).toUTCString().slice(0, 16));
      });
    }
    allTimeStamps.sort(function (a, b) {
      //@ts-ignore
      return new Date(a) - new Date(b);
    });
    allTimeStamps = [...new Set(allTimeStamps)];
    let allObj = {};

    Object.entries(timeStamps).forEach((key) => {
      let dateCounter = allTimeStamps.reduce((accumulator, value) => {
        return { ...accumulator, [value]: 0 };
      }, {});
      key[1].forEach((element) => {
        const testDate = new Date(element).toUTCString().slice(0, 16);
        dateCounter[testDate] = (dateCounter[testDate] || 0) + 1;
      });
      allObj[key[0]] = dateCounter;
    });

    options = {
      chart: {
        type: "bar",
        // height: 350,
        stacked: true,
        toolbar: {
          show: false, // little menu to download graph
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "35%",
          borderRadiusApplication: "around",
          borderRadiusWhenStacked: "last",
          distributed: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: allTimeStamps, //TODO seems ok
        labels: {
          trim: true,
          show: true,
          style: {
            colors: "#FFFFFF",
            fontSize: "12px",
          },
        },
      },
      grid: {
        show: true,
        position: "back",
        borderColor: "#71678A",
      },
      legend: {
        labels: {
          colors: "#FFFFFF",
        },
      },
      yaxis: {
        // title: {
        //   text: "Findings",
        //   style: {
        //     color: "#FFFFFF"
        //   }
        // },
        labels: {
          show: true,
          style: {
            colors: "#FFFFFF",
            fontSize: "12px",
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val; //?? add "findings" ?
          },
        },
        enabled: false,
      },
    };
    series = [
      {
        name: "H",
        color: "#b52828",
        data: Object.entries(allObj.H).map((el) => {
          console.log(el);
          return el[1];
        }),
      },
      {
        name: "M",
        color: "#F2B340",
        data: Object.entries(allObj.M).map((el) => {
          return el[1];
        }),
      },
      {
        name: "QA",
        color: "#1b86ee",
        data: Object.entries(allObj.QA).map((el) => {
          return el[1];
        }),
      },
      {
        name: "Gas",
        color: "#d4c5f9",
        data: Object.entries(allObj.Gas).map((el) => {
          return el[1];
        }),
      },
    ];
  }

  return (
    <>
      {type === "Radial" && unique && total ? (
        <Chart
          //@ts-ignore. Don't understand where is the error coming from
          // working as expected and done according to the doc
          // error is thrown from "stroke:{ lineCap: 'round'}"
          options={options}
          series={series}
          type="radialBar"
          width="280"
        />
      ) : timeStamps ? (
        <Chart
          //@ts-ignore. Don't understand where is the error coming from
          // working as expected and done according to the doc
          // error is thrown from "stroke:{ lineCap: 'round'}"
          options={options}
          series={series}
          type="bar"
          width="800"
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Graph;
