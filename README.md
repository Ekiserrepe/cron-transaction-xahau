# Xahau Hook and CronSet Transaction Examples

This repository contains examples for managing hooks and creating scheduled hook callbacks on the Xahau network.

## Overview

This project demonstrates how to:
- Install and uninstall hooks on Xahau accounts
- Configure account settings for hook collection
- Schedule automated hook callbacks using CronSet transactions

CronSet is a transaction type on Xahau that allows you to schedule automated hook callbacks at specified intervals. This is useful for triggering hook logic on a recurring basis without manual intervention.

## Files

### Hook Management
- **installHook.js** - Installs a hook on your account using a HookHash
- **uninstallHook.js** - Removes/deletes an installed hook from your account
- **accountSet.js** - Activates the asfTshCollect flag to enable Transaction Signature Hook Collection

### CronSet Management
- **cronSet.js** - Creates a CronSet transaction to schedule hook callbacks
- **cronUnset.js** - Removes an existing CronSet transaction

### Configuration
- **package.json** - Dependencies and scripts configuration

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

## Configuration

Before running the scripts, you need to configure your account seed in both `cronSet.js` and `cronUnset.js`:

```javascript
const seed = 'snYourSeedHere'; // Replace with your actual seed, get one at https://xahau-test.net/
```

**Important:** The `seed` is your private key (starts with 's'), NOT your account address (which starts with 'r'). The address will be automatically derived from the seed.

You can get testnet credentials and XAH from: https://xahau-test.net

## Usage

### Hook Management

Before using CronSet transactions, you need to have a hook installed on your account.

#### Installing a Hook

To install a hook on your account:

```bash
node installHook.js
```

This script installs a hook using the following HookHash:
```
83A41BE45166B33E66EF653512396409E1BF9FA85A7C15D0ABC81C24E2890CB3
```

The transaction uses:
- **Flags: 4** (hsfCOLLECT) - Enables hook collection/callback functionality
- **HookOn**: `FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFBFFFFF` - Defines which transaction types trigger the hook

**Important:** Make sure to update your seed in the file before running.

#### Activating Hook Collection (Optional)

If you need to enable Transaction Signature Hook Collection:

```bash
node accountSet.js
```

This sets the `asfTshCollect` flag (flag 11) on your account using an AccountSet transaction.

#### Uninstalling a Hook

If you need to remove the hook from your account for any reason:

```bash
node uninstallHook.js
```

This removes the installed hook by setting `Flags: 2` (hsfNSDELETE) with an empty `CreateCode` field.

### CronSet Management

Once you have a hook installed, you can schedule it to run automatically.

#### Creating a CronSet

To schedule hook callbacks:

```bash
npm run set-cron
```

Or directly:

```bash
node cronSet.js
```

This will create a CronSet transaction with the following parameters:

- **StartTime**: When to begin execution (Ripple Epoch timestamp, or 0 for immediate)
- **RepeatCount**: Number of times to trigger the hook (default: 3)
- **DelaySeconds**: Delay between each execution in seconds (default: 120 seconds / 2 minutes)

#### Removing a CronSet

To remove an existing scheduled cron job:

```bash
npm run unset-cron
```

Or directly:

```bash
node cronUnset.js
```

This sends a CronSet transaction with `Flags: 1` (tfCronUnset) to remove the existing cron job.

## Transaction Formats

### SetHook (Install Hook)

```javascript
{
  "TransactionType": "SetHook",
  "Account": "<your account address>",
  "Hooks": [
    {
      "Hook": {
        "HookHash": "83A41BE45166B33E66EF653512396409E1BF9FA85A7C15D0ABC81C24E2890CB3",
        "HookNamespace": "0000000000000000000000000000000000000000000000000000000000000000",
        "HookOn": "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFBFFFFF",
        "Flags": 4 // hsfCOLLECT - Enables hook collection/callback functionality
      }
    }
  ]
}
```

**Important:** The `Flags: 4` (hsfCOLLECT) goes inside the Hook object to enable hook collection/callback functionality.

### SetHook (Uninstall Hook)

```javascript
{
  "TransactionType": "SetHook",
  "Account": "<your account address>",
  "Hooks": [
    {
      "Hook": {
        "CreateCode": "",
        "Flags": 1
      }
    }
  ]
}
```

### AccountSet (Enable Hook Collection)

```javascript
{
  "TransactionType": "AccountSet",
  "Account": "<your account address>",
  "SetFlag": 11 // asfTshCollect
}
```

### CronSet (Create)

```javascript
{
  "TransactionType": "CronSet",
  "Account": "<hook account address>",
  "StartTime": <Ripple Epoch timestamp or 0>,
  "RepeatCount": 3,
  "DelaySeconds": 120
}
```

### CronSet (Remove)

```javascript
{
  "TransactionType": "CronSet",
  "Account": "<hook account address>",
  "Flags": 1  // tfCronUnset
}
```

**Note:** When removing a CronSet, you must omit `StartTime`, `RepeatCount`, and `DelaySeconds`, and set `Flags: 1`.

## Ripple Epoch Conversion

Xahau uses Ripple Epoch time (seconds since January 1, 2000 00:00 UTC) instead of Unix timestamps.

To convert:
```javascript
const RIPPLE_EPOCH_OFFSET = 946684800;
const rippleEpochTime = Math.floor(Date.now() / 1000) - RIPPLE_EPOCH_OFFSET;
```

## Dependencies

- **xahau** (^4.0.2) - Xahau JavaScript library
- **xrpl-accountlib** (^9.1.0) - Account utilities for signing and submitting transactions

## Network

The examples connect to the Xahau testnet:
```
wss://xahau-test.net
```

## How It Works

1. The script connects to the Xahau network
2. Derives account information from your seed
3. Fetches network values (fee, sequence, last ledger sequence, network ID)
4. Constructs the CronSet transaction
5. Signs and submits the transaction
6. Displays the transaction result

## Example Output

```
Account: rYourAccountAddress
Connected to Xahau
Prepared CronSet transaction: {
  "TransactionType": "CronSet",
  "Account": "rYourAccountAddress",
  "StartTime": 816348759,
  "RepeatCount": 3,
  "DelaySeconds": 120,
  "Fee": "12",
  "Sequence": 123456,
  "LastLedgerSequence": 123531,
  "NetworkID": 21338
}
Transaction result: { ... }
Disconnected from Xahau
```

## Security Notes

- Never commit your seed to version control
- Keep your seed secure and private
- Use environment variables for production deployments
- Only use testnet seeds for testing

## License

MIT

## Resources

- [Xahau Website](https://xahau.network)
- [Xahau Documentation](https://xahau.network/docs)
- [Xahau Testnet Faucet](https://xahau-test.net)
