const ContestsCsvFields = `
type TotalData {
  H: Int
  M: Int
  QA: Int
  Gas: Int
}

type OverviewData {
  total: TotalData
  dupesID: TotalData
}

type ContestsCsvFields implements Node @dontInfer {
  contestPath: String
  submissionPath: String
  artPath: String
  readmeContent: String
  status: String
  judges: [String]
  contestOverview: OverviewData
  totalIssues: Int
}`;

export default ContestsCsvFields;
