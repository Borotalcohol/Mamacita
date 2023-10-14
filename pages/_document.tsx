import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="/static/favicon.ico" rel="shortcut icon" />
        <link href="/dist/output.css" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/pacifico" rel="stylesheet" />
        <meta
          name="description"
          content="Discover Mamacita: A tiny summer project that transforms top 50 Spotify playlists' lyrics into captivating word clouds. Uncover the most sung words in a visually artistic way. Explore the unexpected and groove to the universal language of music."
        />
        <script src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
