# frontend

This is the frontend to create identities and interact with them.

## Getting Started

First, install dependencies with `yarn install`. Then, run the development server with `yarn dev`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Documentation 

`pages/_app.tsx` is the global page which is applied on all pages. It contains the auth state configuration by rainbowkit and renders `Nav` component on all pages.

`pages/index.tsx` is the entry point for the application. It has a rainbowkit connect wallet button and is redirected to whenever a logged-in user is not found.

`pages/dashboard.tsx` is the dashboard page. It retrieves all the identities from the subgraph and renders them.

`pages/create.tsx` is the create identity page. It has a form to create a new identity.

`pages/identity.tsx` is the identity page. It renders multiple components about the identity : `Owners`, `NFTs`, `Tokens`, `QuickActions`

## Learn More

To learn more about the tech stack of this app, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
-   [Tailwind CSS Documentation](https://tailwindcss.com/docs/) - learn about Tailwind, and browse through the included classes.
-   [Ethers Documentation](https://docs.ethers.io/v5/) - learn about Ethers features and API.
-   [wagmi Documentation](https://wagmi.sh/) - learn about wagmi features and API.
-   [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction) - learn about RainbowKit's features and API.

## License

This app is open-source and licensed under the MIT license. For more details, check the [License file](LICENSE).

## Credits

Thanks to m1guelpf for [dapp-starter](https://github.com/m1guelpf/dapp-starter?utm_source=smart-identities) which helped kickstart the app!