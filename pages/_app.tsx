import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NextSeo } from 'next-seo'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title="Life of long COVID-19"
        description='โควิด-19 นับว่าเป็นโรคที่สง่งผลกระทบทั้งระยะสั้นและระยะยาวต่อร่างกายระหว่างการติดเชื้อร่างการจะสร้างถูมิคุ้มกันขึ้นมาเพื่อไปจับกับเซลล์โปรตีนของบางอวัยวะทำให้เกิดการอักเสบในร่างกายเป็นผลให้อวัยวะนั้นๆ ได้รับความเสียหายส่วผลกระทบไปทั่วร่างกาย'
        openGraph={{
          title: 'Life of long COVID-19',
          description:
            'โควิด-19 นับว่าเป็นโรคที่สง่งผลกระทบทั้งระยะสั้นและระยะยาวต่อร่างกายระหว่างการติดเชื้อร่างการจะสร้างถูมิคุ้มกันขึ้นมาเพื่อไปจับกับเซลล์โปรตีนของบางอวัยวะทำให้เกิดการอักเสบในร่างกายเป็นผลให้อวัยวะนั้นๆ ได้รับความเสียหายส่วผลกระทบไปทั่วร่างกาย',
            images: [{
              url: "/"
            }]
        }}
      />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
