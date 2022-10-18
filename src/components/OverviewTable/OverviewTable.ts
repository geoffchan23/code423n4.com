import React from "react";
import { OverviewData } from "../../utils/types";
import "./OverviewTable.css";

const OverviewTable: React.FC<{ overviewData: OverviewData }> = ({
  overviewData,
}) => {
  return (
    <table className="c4-table">
      <thead>
        <tr>
          <th className="c4-table-cell">{""}</th>
          <th className="c4-table-cell c4-title">High</th>
          <th className="c4-table-cell c4-title">Medium</th>
          <th className="c4-table-cell c4-title">QA</th>
          <th className="c4-table-cell c4-title">Gas</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="c4-table-cell c4-title">Total</td>
          <td className="c4-table-cell">{overviewData.total.H}</td>
          <td className="c4-table-cell">{overviewData.total.M}</td>
          <td className="c4-table-cell">{overviewData.total.QA}</td>
          <td className="c4-table-cell">{overviewData.total.Gas}</td>
        </tr>
        <tr>
          <td className="c4-table-cell c4-title">Dupes</td>
          <td className="c4-table-cell">{overviewData.dupesID.H}</td>
          <td className="c4-table-cell">{overviewData.dupesID.M}</td>
          <td className="c4-table-cell">{overviewData.dupesID.QA}</td>
          <td className="c4-table-cell">{overviewData.dupesID.Gas}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default OverviewTable;
