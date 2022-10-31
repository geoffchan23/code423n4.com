const ContestsCsvFields = `

type Award {
  contest: Int
  handle: String
  finding: String
  risk: String
  pie: Float
  split: Int
  slice: Float
  award: Float
  awardCoin: String
  awardUSD: Float
}

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
  totalNeedJudging: Int
  awards: [Award]
}`;

export default ContestsCsvFields;
