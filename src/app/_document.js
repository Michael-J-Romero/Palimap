// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      {/* <Head>
        <script src="/vendor/leaflet-boundary-canvas.js" />
      </Head> */}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
