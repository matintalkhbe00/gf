import fetch from 'node-fetch';

async function action(headers: { [key: string]: string }): Promise<boolean> {
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

async function getNextTime(headers: { [key: string]: string }): Promise<number> {
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

async function handleToken(authToken: string, phoneNumber: string): Promise<void> {
  const headers = { Authorization: `Bearer ${authToken}` };
  let nextTime = await getNextTime(headers);

  while (true) {
    const now = Math.floor(Date.now() / 1000);
    
    if (now >= nextTime) {
      const result = await action(headers);
      if (result) {
        console.log(`Success: Action to earn was successfully completed with phone number ${phoneNumber}`);
        nextTime = await getNextTime(headers);
        console.log(`Success: Got new nextTime with phone number ${phoneNumber}: ${nextTime}`);
      } else {
        console.log(`Failed: Action to earn failed with phone number ${phoneNumber}`);
      }
    }

    await delay(1000);
  }
}

async function makeMoney(authTokensAndPhones: Array<{ token: string; phone: string }>): Promise<void> {
  const promises = authTokensAndPhones.map(({ token, phone }) => handleToken(token, phone));
  await Promise.all(promises);
}


// Array of tokens and corresponding phone numbers
const authTokensAndPhones = [
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTAzZDk1NGI2OTAxNzgwMDk5ZWE5IiwiaWF0IjoxNzI2OTU1NzU2LCJleHAiOjE3MjcwNDIxNTYsInR5cGUiOiJhY2Nlc3MifQ.Ymo-gE-5qJfEuGYkJik2anEPMyKUDavC-IZ7BZWpGfQ", phone: "09045087864" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA0NWMxMjM0Y2ZkYTZlZDc5Yjk5IiwiaWF0IjoxNzI2OTU1ODY1LCJleHAiOjE3MjcwNDIyNjUsInR5cGUiOiJhY2Nlc3MifQ.JpWgMptAq3rU3Vf6rTPJp4354DDT5U4XDvGJHZsfL2Q", phone: "09365087864" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA0ZTEyYTgxMGEwYjQ1OGJjMjI1IiwiaWF0IjoxNzI2OTU1OTc0LCJleHAiOjE3MjcwNDIzNzQsInR5cGUiOiJhY2Nlc3MifQ.iQMjf7C7a89U7J5uWh3p-jY4158gFBE3UxQ-G8Yj6ys", phone: "09191493905" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA2NWEyYTgxMGEwYjQ1OGQ0NWU0IiwiaWF0IjoxNzI2OTU2MTU2LCJleHAiOjE3MjcwNDI1NTYsInR5cGUiOiJhY2Nlc3MifQ.FbBFvN4f_jvpM-MHVg8jFnmBLRmhyTH9iPET2CwR6n0", phone: "09303884022" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZjQzNTc1MDIzMDkwNjNkODc4YzRhIiwiaWF0IjoxNzI2OTU2Mzc1LCJleHAiOjE3MjcwNDI3NzUsInR5cGUiOiJhY2Nlc3MifQ.uqc1Wb058HASck9aznIUiH4DrsqBy7eMOgD701NOvcs", phone: "09025967865" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZjQ0MmU1MDIzMDkwNjNkODkwNzJmIiwiaWF0IjoxNzI2OTU2NTkwLCJleHAiOjE3MjcwNDI5OTAsInR5cGUiOiJhY2Nlc3MifQ.twyND0aNkmc-S7_JNZHkzd8AGhckDAt0-iY-WlYvOmA", phone: "09059549183" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2Y2OThmZjM0YmE2YzMyYzM3ZGFmIiwiaWF0IjoxNzI2OTI1OTE1LCJleHAiOjE3MjcwMTIzMTUsInR5cGUiOiJhY2Nlc3MifQ.garw41ioAstgpmAYjrWeiEuPaPPbyveDWqyBYeb93ho", phone: "09964711498" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZkZGZiNjYxZjdmMGYxNGZmYzkxNDAyIiwiaWF0IjoxNzI2OTUzNzAwLCJleHAiOjE3MjcwNDAxMDAsInR5cGUiOiJhY2Nlc3MifQ.su0rrZYXlqfHszwj8tL2T_lDsRxX2paaKxwOik4fwbY", phone: "09912984617" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2ZhYzI2M2Y3Mzg1MGY4YjJjYTRiIiwiaWF0IjoxNzI2OTUzODM1LCJleHAiOjE3MjcwNDAyMzUsInR5cGUiOiJhY2Nlc3MifQ.ZFZl3SbTQDDa8ZHidBepbrcPHFpINq3cqjRtc_L1qq0", phone: "09025967864" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE4YTM5YTlkNTdkOTNmMDAzODU4IiwiaWF0IjoxNzI2OTU1NTAwLCJleHAiOjE3MjcwNDE5MDAsInR5cGUiOiJhY2Nlc3MifQ.bHCpB_GRhNSmNYlkKL1kYWJa6jdAw-UeaRmDJmTS7fo", phone: "09357792770" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE2M2E5YTlkNTdkOTNmZmJhZDcxIiwiaWF0IjoxNzI2OTU1MzExLCJleHAiOjE3MjcwNDE3MTEsInR5cGUiOiJhY2Nlc3MifQ.DNIfjqnO-x3_oanWtrKoPc5ikcoj3xBwyF0QP4UK-Ig", phone: "09036567864" },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzEwNTc2M2Y3Mzg1MGY4M2ZkN2Y1IiwiaWF0IjoxNzI2OTU1MDcwLCJleHAiOjE3MjcwNDE0NzAsInR5cGUiOiJhY2Nlc3MifQ.qD5CJ1kzCms9e0Mp2ZcovkPLnGOWYnPg0ZoANvNCXl0", phone: "09197473984" }
];


makeMoney(authTokensAndPhones);

console.log("Executed: Started...");
