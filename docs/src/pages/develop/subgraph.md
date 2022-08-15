---
title: Subgraph
---

The subgraph is currently only being used to listen to `NewIdentity` event, store it and to later retrieve all the identities of a owner in the `dashboard` page in the frontend.

## Setting up locally

1. Clone the repo

   ```bash
       git clone https://github.com/sudhamjayanthi/smart-identities.git
   ```

2. Go to subgraph directory

   ```bash
       cd subgraph
   ```

3. Install dependencies

   ```bash
       yarn install
   ```

You can now start editing the handler in the `src` folder.

### Deploying the subgraph
Once you made the changes, you can follow the docs by [thegraph.com](https://thegraph.com/docs/en/cookbook/quick-start/#4-deploy-your-subgraph) to create and deploy the subgraph to the hosted service.
