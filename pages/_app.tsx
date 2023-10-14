import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

import "../dist/output.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Mamacita | Spotify Word Clouds</title>
      </Head>
      <Script
        src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
        strategy="lazyOnload"
        onLoad={(e) => {
          if (window.PayPal && window.PayPal.Donation) {
            window.PayPal.Donation.Button({
              env: "production",
              hosted_button_id: "S7Y2QBUEZKZWW",
              image: {
                src: "https://www.paypalobjects.com/en_US/IT/i/btn/btn_donateCC_LG.gif",
                alt: "Donate with PayPal button",
                title: "PayPal - The safer, easier way to pay online!",
              },
            }).render("#donate-button");
          }
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
