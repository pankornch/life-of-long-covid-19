import { Html, Head, Main, NextScript } from 'next/document'

function document() {
  return (
    <Html>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="apple-touch-icon" href="/icon.png"></link> */}
        <meta name="theme-color" content="#B2B5FD" />
      </Head>
      <Main />
      <NextScript />
    </Html>
  )
}

export default document
