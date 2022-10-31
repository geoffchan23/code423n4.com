export async function fetchAwardCalc(contestId, sponsorName, url, baseLocalUrl, jwt_token) {
  const res = await fetch(`${baseLocalUrl}awardCalc`, {
    method: "POST",
    body: JSON.stringify({
      token: jwt_token,
      contestId,
      sponsorName,
      url,
      awardInfo: {
        mainPool: 5,
        gasPool: 1,
        qaPool: 1,
        awardCoin: "USDC",
        awardCoinInUSD: 1,
      },
    }),
  });

  let response;
  if (res.ok) {
    response = await res.json();
  } else {
    response = 0;
  }
  return response;
}

export async function fetchUntouchedIssues(repoName, baseLocalUrl, jwt_token) {
  const res = await fetch(`${baseLocalUrl}getAllUntouchedIssues?repo_name=${repoName}&role=judges`, {
    method: "POST",
    body: JSON.stringify({ token: jwt_token }),
  });
  let response;
  if (res.ok) {
    response = await res.json();
  } else {
    response = 0;
  }
  return response;
}

export async function fetchContestOverviewData(repoName, baseLocalUrl, jwt_token) {
  const res = await fetch(`${baseLocalUrl}constestStatus?repo_name=${repoName}`, {
    method: "POST",
    body: JSON.stringify({ token: jwt_token }),
  });
  let response;
  if (res.ok) {
    response = await res.json();
  } else {
    response = {
      overviewGrid: {
        total: { H: 0, M: 0, QA: 0, Gas: 0 },
        dupesID: { H: 0, M: 0, QA: 0, Gas: 0 },
      },
    };
  }
  return response;
}

export async function fetchJudges(repoName, baseLocalUrl, jwt_token) {
  const res = await fetch(`${baseLocalUrl}getJudges?repo_name=${repoName}`, {
    method: "POST",
    body: JSON.stringify({ token: jwt_token }),
  });
  let response;
  if (res.ok) {
    response = await res.json();
  } else {
    response = { judges: [] };
  }
  return response;
}
