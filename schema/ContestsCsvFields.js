const ContestsCsvFields = `

type Award {
  handle: String
  awardCoin: String
  awardTotal: Float
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
  unique: TotalData
}

type ContestsCsvFields implements Node @dontInfer {
  contestPath: String
  submissionPath: String
  artPath: String
  readmeContent: String
  status: String
  contestOverview: OverviewData
  totalIssues: Int
  totalNeedJudging: Int
  awards: [Award]
  topWardens: [Award]
}`;

export default ContestsCsvFields;
