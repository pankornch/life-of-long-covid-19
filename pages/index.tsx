import Layout from '@components/Layout'
import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <Layout title="Welcome Life of long COVID-19">
      <div className="space-y-6">
        <h1 className="text-center">ชีวิตดี๊ดี หลังเป็นโควิด-19</h1>
        <p className="text-center">
          โควิด-19 นับว่าเป็นโรคที่ส่งผลกระทบทั้งระยะสั้น
          และระยะยาวต่อร่างกายระหว่างการติดเชื้อร่างกาย
          จะสร้างภูมิคุ้มกันขึ้นมาเพื่อไปจับกับเซลล์โปรตีนของบาง
          อวัยวะทำให้เกิดการอักเสบในร่างกายเป็นผลให้อวัยวะนั้นๆ
          ได้รับความเสียหาย ส่งผลกระทบไปทั่วร่างกาย
        </p>
        <Link href="/assessment">
          <button className="btn bg-primary text-lg font-bold text-white">
            ทำแบบประเมิน
          </button>
        </Link>

        <img
          src="/images/doctor.png"
          alt="doctor"
          className="w-full object-contain pt-12"
        />
      </div>
    </Layout>
  )
}

export default Home
