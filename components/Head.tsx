import GA from "./GA";
import _Head from "next/head";

const title = "Project Sekai";
const desc = "Convert your MyAnimeList anime list to force-directed graph and see your anime world.";
const image = "/images/main.jpg";

export default function Head() {
  return (
    <>
      <_Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={title} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html charset=utf-8" />
        <meta name="theme-color" content="#2196f3" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </_Head>
      <GA />
    </>
  );
}
