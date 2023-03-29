# Thala Indexer

Powered by sentio.

## Development

1. Get ABI of a Move module in https://mainnet.aptoslabs.com/v1/accounts/<account>/modules. Add the JSON file under `projects/<newproject>/abis/aptos` folder.
1. Edit `src/processor.ts`.
1. Build: `make <newproject>`. Or build all: `make`.
1. Upload: `make upload-<newproject>`.
1. Before push, `yarn prettier`.

## How to add a processor

1. Run `yarn sentio create <newproject> -p -d projects -c aptos` from the root.
1. Edit `sentio.yaml` to also include org name `thala-labs`. For example, `lbp` -> `thala-labs/lbp`.
1. Follow [Development](#development).
