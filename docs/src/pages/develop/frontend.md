---
title: Frontend
---

## Tech

The frontend is built using [Next JS](https://nextjs.com) (Typescript), [RainbowKit](https://rainbowkit.com), [Tailwind CSS](https://tailwindcss.com) & deployed on [Vercel](https://vercel.com)

## File Structure (src/)

### pages

1. `index.tsx` : log in (connect wallet) page
2. `dashboard.tsx` : all the identities you are owner of appears here (data is pulled from [subgraph](/develop/subgraph))
3. `create.tsx` : page to create new identity
4. `_app.tsx` : contains rainbow config, `nav.tsx` and other global stuff
5. `identity/[address].tsx` : profile page of a identity

### components

- `Nav.tsx` : navbar rendered in all pages
- `Modal.tsx` : used in a couple of places to render modals (modification of headlessui's modal)
- `FeedbackWidget.tsx` : feedback.fish widget to collect user Feedback

#### identity

contains all the components for the `identity` page.

1. `SendETH.tsx`, `SendERC20.tsx` & `SendNFT.tsx` (self explanatory)
2. `Owner.tsx` & `Owners.tsx` : used to render owners of the `identity`
3. `ERC20.tsx` & `ERC20s.tsx` : used to render accepted tokens on the `identity` page
4. `NFT.tsx` & `NFTs.tsx` : used to render NFTs sent to the `identity`
5. `PickToken.tsx` : a slick component to pick ERC20s from
6. `QuickActions.tsx` : renders owner actions on the `identity` page



### styles

1. `globals.css` : basically has styles that are complex to do in tailwind

### utils

1. has contract abis to interact with them
2. `copyToClipboard.ts` : copies text to clipboard (used in identity page)
3. `avatarFromAddress.ts` : generates avatar from address (used in dashboard and identity pages)

### lib

1. `constants.js` - has chain, explorer and contract address
2. `tokens.js`
   - token list used in `PickToken.tsx` component
   - it's soured from [tokenlists.org](https://tokenlists.org) and
     adapted with a simple python script to filter only the optimism mainnet tokens, add `id` field & remove `extensions` field.

## Setting up locally

1. Clone the repo

   ```bash
    git clone https://github.com/sudhamjayanthi/smart-identities.git
   ```

2. Go to frontend directory

   ```bash
    cd frontend
   ```

3. Install dependencies

   ```bash
    yarn install
   ```

4. Run dev server

   ```bash
    yarn dev
   ```

That's it. Open [localhost:3000](localhost:3000) to see the app.

## Deploying

After making your changes, open a pull request on the repo. Vercel will automatically deploy and create a preview for it, once everything looks good i'll merge it.
