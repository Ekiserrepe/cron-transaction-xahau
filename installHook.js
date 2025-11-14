const xahau = require('xahau');
const { derive, utils, signAndSubmit } = require("xrpl-accountlib");

const seed = 'yourSeed'; // Replace with your actual seed, get one at https://xahau-test.net/
const network = "wss://xahau-test.net";

async function installHook() {
  const client = new xahau.Client(network);
  const account = derive.familySeed(seed, { algorithm: "secp256k1" });
  console.log(`Account: ${account.address}`);

  try {
    await client.connect();
    console.log('Connected to Xahau');

    const networkInfo = await utils.txNetworkAndAccountValues(network, account);

    const prepared = {
      "TransactionType": "SetHook",
      "Account": account.address,
      "Hooks": [
        {
          "Hook": {
            "HookHash": "83A41BE45166B33E66EF653512396409E1BF9FA85A7C15D0ABC81C24E2890CB3",
            "HookNamespace": "0000000000000000000000000000000000000000000000000000000000000000",
            "HookOn": "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFBFFFFF",
            "Flags": 4
          }
        }
      ],
      ...networkInfo.txValues,
    };

    console.log("Prepared SetHook transaction:", JSON.stringify(prepared, null, 2));

    const tx = await signAndSubmit(prepared, network, account);
    console.log("Transaction result:", JSON.stringify(tx, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
    console.log('Disconnected from Xahau');
  }
}

installHook();
