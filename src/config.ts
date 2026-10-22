import type { Site, SocialMediaObjects } from "./types";

export const SITE: Site = {
  website: "https://astro-paper-rho-inky.vercel.app/",
  author: "Digital Skills Hub",
  profile: "https://astro-paper-rho-inky.vercel.app/",
  desc: "Discover proven strategies for online earning, digital skills, CPA marketing, and modern work-from-home techniques.",
  title: "Digital Skills Hub",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: true,
  showBackButton: true,
  editPost: {
    url: "",
    text: "",
    appendFilePath: false,
  },
};

export const LOCALE = {
  lang: "en",
  langTag: ["en-EN"],
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialMediaObjects = [
  {
    name: "Github",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: ` ${SITE.title} on Github`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: ` ${SITE.title} on Instagram`,
    active: false,
  },
  {
    name: "Mail",
    href: "mailto:yourmail@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
];
