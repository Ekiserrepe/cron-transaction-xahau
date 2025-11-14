const xahau = require('xahau');
const { derive, utils, signAndSubmit } = require("xrpl-accountlib");

const seed = 'yourSeed'; // Replace with your seed
const network = "wss://xahau-test.net";

async function removeCronSet() {
  const client = new xahau.Client(network);
  const account = derive.familySeed(seed, { algorithm: "secp256k1" });
  console.log(`Account: ${account.address}`);

  try {
    await client.connect();
    console.log('Connected to Xahau');

    const networkInfo = await utils.txNetworkAndAccountValues(network, account);

    const prepared = {
      "TransactionType": "CronSet",
      "Account": account.address, // Your Hook address
      "Flags": 1, // tfCronUnset - this removes the cron job
      ...networkInfo.txValues,
    };

    console.log("Prepared CronUnset transaction:", JSON.stringify(prepared, null, 2));

    const tx = await signAndSubmit(prepared, network, account);
    console.log("Transaction result:", JSON.stringify(tx, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
    console.log('Disconnected from Xahau');
  }
}

removeCronSet();
