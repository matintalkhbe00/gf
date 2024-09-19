import fetch from 'node-fetch';

// تعریف نوع برای هدرها
interface Headers {
  Authorization: string;
}

// تعریف نوع برای تابع delay
function delay(ms: number): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms));
}

// تابع action با پارامتر هدر
async function action(headers: Headers): Promise<boolean> {
  const res = await fetch(
    "https://dev-api.goatsbot.xyz/missions/action/66db47e2ff88e4527783327e",
    {
      method: "POST",
      headers,
    }
  );

  await res.json();

  return res.status === 201;
}

// تابع getNextTime با پارامتر هدر
async function getNextTime(headers: Headers): Promise<string> {
  const res = await fetch("https://api-mission.goatsbot.xyz/missions/user", {
    headers,
  });

  if (res.status !== 200) {
    throw new Error("Get missions request failed");
  }
  const data = await res.json();

  return data["SPECIAL MISSION"][0]["next_time_execute"];
}

// تابع makeMoney با پارامتر هدر
async function makeMoney(authTokens: string[]): Promise<void> {
  for (const token of authTokens) {
    const headers: Headers = {
      Authorization: token,
    };

    let nextTime = await getNextTime(headers);

    while (true) {
      const now = Math.floor(Date.now() / 1000);
      if (now >= Number(nextTime)) {
        const result = await action(headers);
        if (result) {
          console.log("success: Action to earn was successfully completed");
          nextTime = await getNextTime(headers);
          console.log(`success: get new nextTime: ${nextTime}`);
        } else {
          console.log("Failed: Action to earn failed");
        }
      } else {
        console.log(`while: time left for next action: ${nextTime - now}s`);
      }

      await delay(1000);
    }
  }
}

// لیست توکن‌ها
const authTokens: string[] = [
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2Y2OThmZjM0YmE2YzMyYzM3ZGFmIiwiaWF0IjoxNzI2NzQ2MzgyLCJleHAiOjE3MjY4MzI3ODIsInR5cGUiOiJhY2Nlc3MifQ.2Q--9c2-dQFRACZ2_LuxH9PESpSw7DztlMFRWN1a_eM",
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZkZGZiNjYxZjdmMGYxNGZmYzkxNDAyIiwiaWF0IjoxNzI2NzQ0MTQxLCJleHAiOjE3MjY4MzA1NDEsInR5cGUiOiJhY2Nlc3MifQ.ramXMlbuur_9a94xCE-xAGq5ttapynVBq9_W4yJzadU",
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2ZhYzI2M2Y3Mzg1MGY4YjJjYTRiIiwiaWF0IjoxNzI2NzQ2NTYxLCJleHAiOjE3MjY4MzI5NjEsInR5cGUiOiJhY2Nlc3MifQ.6uxzVl-TEa0M1nofppqM6-x5owV74VxHgUhz-uYIzmQ",
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzEwNTc2M2Y3Mzg1MGY4M2ZkN2Y1IiwiaWF0IjoxNzI2NzQ2NzEyLCJleHAiOjE3MjY4MzMxMTIsInR5cGUiOiJhY2Nlc3MifQ.JUZfoAKU5fbtXcvMt_oexGyByob7tdiuOCOEc5BrYkc",
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE2M2E5YTlkNTdkOTNmZmJhZDcxIiwiaWF0IjoxNzI2NzQ4MjE4LCJleHAiOjE3MjY4MzQ2MTgsInR5cGUiOiJhY2Nlc3MifQ.XdTFQ4BuE0SaL8SP1M39WoPSlOmKhmHjIaaV0pFq1n8",
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE4YTM5YTlkNTdkOTNmMDAzODU4IiwiaWF0IjoxNzI2NzQ4ODM1LCJleHAiOjE3MjY4MzUyMzUsInR5cGUiOiJhY2Nlc3MifQ.UGK43oqZ75CEfEXWuBMADsFRfRxcGj_pSutyA3i2Dh0",
];

makeMoney(authTokens).catch(console.error);
