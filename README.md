# Thala Processor

Thala indexer powered by sentio

## How to add a processor

1. Create a new `project` under the `./projects` directory

2. Run `npx -y -p @sentio/cli sentio create <projectName>` from the project directory

3. Replace `sentio.yaml` project with your project name, and rename `package.json` name to your project name

4. Get ABI of a Move module in https://testnet.aptoslabs.com/v1/accounts/0x773995cd706f3b4adc6146072ec9bf332bf4648af714c2aeba9395fa00b7018e/modules or https://mainnet.aptoslabs.com/v1/accounts/0x773995cd706f3b4adc6146072ec9bf332bf4648af714c2aeba9395fa00b7018e/modules. Replace the address of the link. Add the JSON file under `./projects/<yourprojectname>/abis/aptos` folder. You can use `npx prettier --write .` to format the ABI.

5. Generate types by `yarn build`. This will generate files under `src/types/aptos` folder.

6. Add a processor script under `src/processor.ts`

7. Upload processor by `yarn upload`
