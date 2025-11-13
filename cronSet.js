const xahau = require('xahau');
const { derive, utils, signAndSubmit } = require("xrpl-accountlib");

const seed = 'snYcygNrNVSUR8PdPYq2P3w7UTBPm'; // Replace with your seed
const network = "wss://xahau-test.net";

async function createCronSet() {
  const client = new xahau.Client(network);
  const account = derive.familySeed(seed, { algorithm: "secp256k1" });
  console.log(`Account: ${account.address}`);

  try {
    await client.connect();
    console.log('Connected to Xahau');

    const networkInfo = await utils.txNetworkAndAccountValues(network, account);

    // Convert current time to Ripple Epoch (seconds since January 1, 2000 00:00 UTC)
    const RIPPLE_EPOCH_OFFSET = 946684800;
    const currentUnixTime = Math.floor(Date.now() / 1000);
    const startTimeRippleEpoch = currentUnixTime - RIPPLE_EPOCH_OFFSET + 60; // Start in 1 minute

    const prepared = {
      "TransactionType": "CronSet",
      "Account": account.address, // Your Hook address
      "StartTime": startTimeRippleEpoch, // Or use 0 for immediate start
      "RepeatCount": 3, // Number of times to repeat the task
      "DelaySeconds": 120, // 2 minutes
      ...networkInfo.txValues,
    };

    console.log("Prepared CronSet transaction:", JSON.stringify(prepared, null, 2));

    const tx = await signAndSubmit(prepared, network, account);
    console.log("Transaction result:", JSON.stringify(tx, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
    console.log('Disconnected from Xahau');
  }
}

createCronSet();
