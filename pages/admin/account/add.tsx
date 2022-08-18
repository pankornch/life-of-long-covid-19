import Input from '@components/Form/Input'
import Navbar from '@components/Navbar'
import { RefreshIcon } from '@heroicons/react/solid'
import { adminRegister } from '@src/services/firebase'
import { Formik, FormikHelpers } from 'formik'
import Link from 'next/link'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

interface IForm {
  tel: string
  password: string
  fullName: string
}

const AdminAccount = () => {
  const initialValues: IForm = {
    tel: '',
    password: '',
    fullName: '',
  }
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (
    values: IForm,
    formikHelpers: FormikHelpers<IForm>
  ) => {
    setLoading(true)
    await adminRegister(values.tel, values.password, values.fullName)
    Swal.fire('เพิ่มบัญชีสำเร็จ', '', 'success')
    setLoading(false)
    formikHelpers.resetForm()
  }

  return (
    <div>
      <Navbar />
      <div className="container space-y-6 py-12">
        <h3 className="text-center">เพิ่มบัญชีแอดมิน / 
        <Link href="/admin/account">
          <span className='underline ml-1'>ดู</span>
        </Link>
        </h3>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ handleSubmit, handleBlur, handleChange, values }) => (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="เบอร์โทร"
                name="tel"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.tel}
              />
              <Input
                label="ชื่อ-นามสกุล"
                name="fullName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fullName}
              />
              <Input
                label="รหัสผ่าน"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              <div className="h-6"></div>
              <button
                type="submit"
                className="btn bg-primary text-white flex justify-center gap-3"
                disabled={loading}
              >
                เพิ่มบัญชี
                {loading && <RefreshIcon className='w-8 animate-spin' />}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AdminAccount
