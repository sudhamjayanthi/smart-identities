import { IPage, ISidebarContent } from "../types";

const makePage = (
  title: string,
  category?: string,
  tags?: string[],
  slug?: string,
): IPage => ({
  title,
  tags,
  category,
  slug:
    slug ??
    `/${category != null ? category + "/" : ""}${title
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
});

export const sidebarContent: ISidebarContent = [
  // The goal is to have the docs be in a narrative structure
  {
    title: "BASICS",
    pages: [
      makePage("Introduction", undefined, ["home", "introduction", "index"], "/"),
      makePage("Learn More", undefined, ["learn more", "demo", "try it out", "live", "questions"]),
    ],
  },
  {
    title: "DEVELOP",
    pages: [
      makePage("Overview", "develop", ["getting started", "overview", "help", "contribute", "contact"]),
      makePage("Contracts", "develop", ["contracts", "smart contracts", "backend", "solidity", "contract address"]),
      makePage("Frontend", "develop", ["ui", "frontend"]),
      makePage("Subgraph", "develop", ["subgraph"]),
    ],
  },
];
