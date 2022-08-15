import Image from "next/image";
import React from "react";
import "twin.macro";
import { Link } from "../components/Link";
import { SEO } from "../components/SEO";

const NotFoundPage: React.FC = () => (
  <>
    <SEO title="Not Found" />
    <div tw="prose">
      <h1>404: Page not found</h1>
      
      <p>Get back to <Link href="/">Home</Link></p>
    </div>
  </>
);

export default NotFoundPage;
