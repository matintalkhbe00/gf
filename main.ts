import fetch from 'node-fetch';

async function action(headers: Record<string, string>): Promise<boolean> {
  const res = await fetch(
    "https://dev-api.goatsbot.xyz/missions/action/66db47e2ff88e4527783327e",
    {
      method: "POST",
      headers,
    }
  );

  const json = await res.json();
  return res.status === 201;
}

async function getNextTime(headers: Record<string, string>): Promise<number> {
  const res = await fetch("https://api-mission.goatsbot.xyz/missions/user", {
    headers,
  });

  if (res.status !== 200) {
    throw new Error("Get missions request failed");
  }

  const data = await res.json();
  return data["SPECIAL MISSION"][0]["next_time_execute"];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleToken(authToken: string): Promise<void> {
  const headers: Record<string, string> = { Authorization: `Bearer ${authToken}` };
  let nextTime = await getNextTime(headers);

  while (true) {
    const now = Math.floor(Date.now() / 1000);
    
    if (now >= nextTime) {
      const result = await action(headers);
      if (result) {
        console.log(`Success: Action to earn was successfully completed with token ${authToken}`);
        nextTime = await getNextTime(headers);
        console.log(`Success: Got new nextTime with token ${authToken}: ${nextTime}`);
      } else {
        console.log(`Failed: Action to earn failed with token ${authToken}`);
      }
    } else {
      // console.log(`Waiting: Time left for next action with token ${authToken}: ${nextTime - now}s`);
    }

    await delay(1000);
  }
}

async function makeMoney(authTokens: string[]): Promise<void> {
  // Create an array of promises, one for each token
  const promises = authTokens.map(token => handleToken(token));

  // Use Promise.all to run all promises concurrently
  await Promise.all(promises);
}

// List of your authorization tokens
const authTokens: string[] = [
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2Y2OThmZjM0YmE2YzMyYzM3ZGFmIiwiaWF0IjoxNzI2NzQ2MzgyLCJleHAiOjE3MjY4MzI3ODIsInR5cGUiOiJhY2Nlc3MifQ.2Q--9c2-dQFRACZ2_LuxH9PESpSw7DztlMFRWN1a_eM", // 09912984617
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZkZGZiNjYxZjdmMGYxNGZmYzkxNDAyIiwiaWF0IjoxNzI2NzQ0MTQxLCJleHAiOjE3MjY4MzA1NDEsInR5cGUiOiJhY2Nlc3MifQ.ramXMlbuur_9a94xCE-xAGq5ttapynVBq9_W4yJzadU", // 09025967864
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2ZhYzI2M2Y3Mzg1MGY4YjJjYTRiIiwiaWF0IjoxNzI2NzQ2NTYxLCJleHAiOjE3MjY4MzI5NjEsInR5cGUiOiJhY2Nlc3MifQ.6uxzVl-TEa0M1nofppqM6-x5owV74VxHgUhz-uYIzmQ", // 09964711498
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzEwNTc2M2Y3Mzg1MGY4M2ZkN2Y1IiwiaWF0IjoxNzI2NzQ2NzEyLCJleHAiOjE3MjY4MzMxMTIsInR5cGUiOiJhY2Nlc3MifQ.JUZfoAKU5fbtXcvMt_oexGyByob7tdiuOCOEc5BrYkc", // 09197473984
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE2M2E5YTlkNTdkOTNmZmJhZDcxIiwiaWF0IjoxNzI2NzQ4MjE4LCJleHAiOjE3MjY4MzQ2MTgsInR5cGUiOiJhY2Nlc3MifQ.XdTFQ4BuE0SaL8SP1M39WoPSlOmKhmHjIaaV0pFq1n8", // 09036567864
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE4YTM5YTlkNTdkOTNmMDAzODU4IiwiaWF0IjoxNzI2NzQ4ODM1LCJleHAiOjE3MjY4MzUyMzUsInR5cGUiOiJhY2Nlc3MifQ.UGK43oqZ75CEfEXWuBMADsFRfRxcGj_pSutyA3i2Dh0", // 09357792770
];

makeMoney(authTokens);

console.log("Executed: Started...");
