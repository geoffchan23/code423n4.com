import React, { useState } from "react";
import Chart from "react-apexcharts";
import "./charts.css";

const RadialGraph: React.FC<{ total: number; unique: number }> = ({
  total,
  unique,
}) => {
  const displayTotal = Math.round((unique / total) * 100);
  const optionsRadial = {
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
            opacity: 0.0
          }
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
            opacity: 0.35
          }
        },
        dataLabels: {
          showOn: "always",
          name: {
            offsetY: 10,
            show: true,
            color: "#fafafa",
            fontSize: "50px"
          },
          value: {
            formatter: function (val) {
              return `${val}%`;
            },
            color: "#fafafa",
            fontSize: "40px",
            show: false
          }
        }
      }
    },
    fill: {
      colors: ["#5FFFC5"],
    },
    stroke: {
      lineCap: 'round'
    },
    // labels: [`${displayTotal.toString()} %`]
    labels:[`${unique.toString()}`]
  }

  const seriesRadial = [displayTotal];

  return (
    <>
      <Chart
        //@ts-ignore. Don't understand where is the error coming from
        // working as expected and done according to the doc
        // error is thrown from "stroke:{ lineCap: 'round'}"
        options={optionsRadial}
        series={seriesRadial}
        type="radialBar"
        width="280"
        name="ok"
      />
    </>
  );
};

export default RadialGraph;
