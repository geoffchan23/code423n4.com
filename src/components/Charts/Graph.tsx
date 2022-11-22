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
}> = ({ total, unique, type, timeStamps }) => {
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
    for (const [key, value] of Object.entries(timeStamps)) {
      //@ts-ignore
      // allTimeStamps = [...new Set([...allTimeStamps, ...value])];
      // allTimeStamps = [...allTimeStamps, ...value];
      value.forEach(date => {
        //@ts-ignore
        allTimeStamps.push(new Date(date).toUTCString())
      })
    }
    console.log("allTimeStamps", allTimeStamps)
    options = {
      chart: {
        id: "basic-bar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: "50%"
        }
      },
      stroke: {
        width: [4, 0, 0]
      },
      xaxis: {
        categories: [allTimeStamps],
        type: "datetime",
        datetimeUTC: true,
        labels: {
          format: 'dd/MM',
        }
        // labels: {
        //   formatter: function (value, timestamp) {
        //     return new Date(timestamp) // The formatter function overrides format property
        // },
      },
      markers: {
        size: 6,
        strokeWidth: 3,
        fillOpacity: 0,
        strokeOpacity: 0,
        hover: {
          size: 8
        }
      },
      yaxis: {
        tickAmount: 3,
        min: 0,
        // max: 100
      }
    }
    series = [
      {
        name: "H",
        type: "column",
        data: [timeStamps.H]
      },
      {
        name: "M",
        type: "column",
        data: [timeStamps.M]
      },
      {
        name: "QA",
        type: "column",
        data: [timeStamps.QA]
      },
      {
        name: "Gas",
        type: "column",
        data: [timeStamps.Gas]
      }
    ]
    console.log(timeStamps.H);
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
          type="line"
          width="500"
        />
        )
        :''
      }
    </>
  );
};

export default Graph;
