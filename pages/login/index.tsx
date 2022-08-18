import Input from '@components/Form/Input'
import Navbar from '@components/Navbar'
import { adminLogin } from '@src/services/firebase'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import React from 'react'
import Swal from 'sweetalert2'

interface IForm {
  tel: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()
  const handleSubmit = async (values: IForm) => {
    const res = await adminLogin(values.tel, values.password)
    if (!res) {
      Swal.fire(
        'เข้าสู่ระบบไม่สำเร็จ',
        'กรุณาตรวจสอบเบอร์ หรือรหัสผ่านอีกครั้ง',
        'error'
      )
      return
    }

    await Swal.fire('เข้าสู่ระบบสำเร็จ', '', 'success')
    localStorage.setItem("uid", res.id)
    router.push('/admin')
  }

  const initialValues: IForm = {
    tel: '',
    password: '',
  }

  return (
    <div className="space-y-12">
      <div className="bg-primary">
        <Navbar title="Life of long COVID-19" />
      </div>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ handleSubmit, values, handleChange, handleBlur }) => (
          <form onSubmit={handleSubmit} className="container space-y-6">
            <h2 className="text-center">เข้าสู่ระบบ</h2>
            <Input
              name="tel"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.tel}
              type="text"
              label="เบอร์โทร"
            />
            <Input
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              type="password"
              label="รหัสผ่าน"
            />
            <button type="submit" className="btn bg-primary text-white">
              เข้าสู่ระบบ
            </button>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage
