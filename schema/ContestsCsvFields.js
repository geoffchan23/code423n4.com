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

type TimeStampsData {
  H: [String]
  M: [String]
  QA: [String]
  Gas: [String]
}

type OverviewData {
  total: TotalData
  dupesID: TotalData
  unique: TotalData
  timeStamps: TimeStampsData
}

type ContestsCsvFields implements Node @dontInfer {
  contestPath: String
  submissionPath: String
  artPath: String
  readmeContent: String
  status: String
  contestOverview: OverviewData
  totalIssues: Int
  totalJudged: Int
  awards: [Award]
  topWardens: [Award]
  codeAccess: String
  judges: [String]
}`;

export default ContestsCsvFields;
