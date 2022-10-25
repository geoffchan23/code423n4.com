import React from "react";
import { OverviewData } from "../../../types/finding";
import "./OverviewTable.css";

const OverviewTable: React.FC<{ overviewData: OverviewData }> = ({
  overviewData,
}) => {
  console.log("overviewData", overviewData);
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
          <td className="c4-table-cell">{overviewData?.total?.H || 0}</td>
          <td className="c4-table-cell">{overviewData?.total?.M || 0}</td>
          <td className="c4-table-cell">{overviewData?.total?.QA || 0}</td>
          <td className="c4-table-cell">{overviewData?.total?.Gas || 0}</td>
        </tr>
        <tr>
          <td className="c4-table-cell c4-title">Duplicates</td>
          <td className="c4-table-cell">{overviewData?.dupesID?.H || 0}</td>
          <td className="c4-table-cell">{overviewData?.dupesID?.M || 0}</td>
          <td className="c4-table-cell">{overviewData?.dupesID?.QA || 0}</td>
          <td className="c4-table-cell">{overviewData?.dupesID?.Gas || 0}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default OverviewTable;
