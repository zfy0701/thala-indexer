# Thala Processor

Thala indexer powered by sentio

## How to add a processor

1. Get ABI of a Move module in https://testnet.aptoslabs.com/v1/accounts/0x773995cd706f3b4adc6146072ec9bf332bf4648af714c2aeba9395fa00b7018e/modules or https://mainnet.aptoslabs.com/v1/accounts/0x773995cd706f3b4adc6146072ec9bf332bf4648af714c2aeba9395fa00b7018e/modules. Replace the address of the link. Add the JSON file under `abis/aptos/<network>` folder. You can use `npx prettier --write .` to format the ABI.

2. Generate types by `yarn build`. This will generate files under `src/types/aptos` folder.

3. Add a processor script under `src/processors`

4. Import the processor script in `src/processor.ts`. This is the entry point of Webpack.

5. Upload processor by `yarn upload`
