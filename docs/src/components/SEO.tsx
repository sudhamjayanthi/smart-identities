import * as React from "react";
import { DefaultSeo, NextSeo, NextSeoProps } from "next-seo";
import Head from "next/head";
import { DefaultSeoProps } from "next-seo";

export interface Props extends NextSeoProps {
  title?: string;
  description?: string;
  image?: string;
}

const title = "Smart Identities Docs";
export const url = "https://docs.smart-identities.sudham.xyz";
const description = "Documentation for Smart Identities.";
const image = "https://docs.railway.app/og.png";

const config: DefaultSeoProps = {
  title,
  description,
  openGraph: {
    type: "website",
    url,
    site_name: title,
    images: [{ url: image }],
  },
  twitter: {
    handle: "@sudhamjayanthi",
    cardType: "summary_large_image",
  },
};

export const SEO: React.FC<Props> = ({ image, ...props }) => {
  const title = props.title ?? config.title;
  const description = props.description || config.description;

  return (
    <>
      <DefaultSeo {...config} />

      <NextSeo
        {...props}
        {...(image == null
          ? {}
          : {
            openGraph: {
              images: [{ url: image }],
            },
          })}
      />

      <Head>
        <title>{title}</title>

        <meta name="description" content={description} />
      </Head>
    </>
  );
};
