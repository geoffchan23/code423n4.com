import React from "react";
import { OverviewData } from "../../../types/finding";
import "./OverviewTable.css";

const OverviewTable: React.FC<{ overviewData: OverviewData }> = ({
  overviewData,
}) => {
  return (
    // <table className="c4-table">
    //   <thead>
    //     <tr>
    //       <th className="c4-table-cell">{""}</th>
    //       <th className="c4-table-cell c4-title">High</th>
    //       <th className="c4-table-cell c4-title">Medium</th>
    //       <th className="c4-table-cell c4-title">QA</th>
    //       <th className="c4-table-cell c4-title">Gas</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     <tr>
    //       <td className="c4-table-cell c4-title">Confirmed</td>
    //       <td className="c4-table-cell">{overviewData.unique!.H}</td>
    //       <td className="c4-table-cell">{overviewData.unique!.M}</td>
    //       <td className="c4-table-cell">{overviewData.unique!.QA}</td>
    //       <td className="c4-table-cell">{overviewData.unique!.Gas}</td>
    //     </tr>
    //     <tr>
    //       <td className="c4-table-cell c4-title">Total</td>
    //       <td className="c4-table-cell">{overviewData.total.H}</td>
    //       <td className="c4-table-cell">{overviewData.total.M}</td>
    //       <td className="c4-table-cell">{overviewData.total.QA}</td>
    //       <td className="c4-table-cell">{overviewData.total.Gas}</td>
    //     </tr>
    //   </tbody>
    // </table>
    <div className="overview-main">
      <div className="overview-grid-row">
        <p>{" "}</p>
        <p>High</p>
        <p>Medium</p>
        <p>Gas</p>
        <p>QA</p>
      </div>
      <div className="overview-grid-row">
        <p>Confirmed</p>
        <p>{overviewData.unique!.H}</p>
        <p>{overviewData.unique!.M}</p>
        <p>{overviewData.unique!.QA}</p>
        <p>{overviewData.unique!.Gas}</p>
      </div>
      <div className="overview-grid-row">
        <p>Total</p>
        <p>{overviewData.total!.H}</p>
        <p>{overviewData.total!.M}</p>
        <p>{overviewData.total!.QA}</p>
        <p>{overviewData.total!.Gas}</p>
      </div>
    </div>
  );
};

export default OverviewTable;
