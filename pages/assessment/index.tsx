import AssessmentProgress from '@components/AssessmentProgress'
import FlatList from '@components/FlatList'
import Input from '@components/Form/Input'
import Select from '@components/Form/Select'
import Layout from '@components/Layout'
import {
  CheckCircleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import { Formik, FormikHelpers, useFormikContext } from 'formik'
import { NextPage } from 'next'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { classes, deepClone, resolvePath } from '@src/utils'
import * as yup from 'yup'
import {
  COVID_ANXIETY,
  COVID_TEST,
  RATEUS,
  ST5,
  SYNDROMES,
  _2Q,
  _9Q,
} from '@src/data'
import Modal from '@components/Modal'
import { v1 } from 'uuid'
import ReactMarkdown from 'react-markdown'
import calculate from '@src/utils/calculate'
import Swal from 'sweetalert2'
import { IChoice, ICovidHistory, IForm } from '@src/types'
import { formSubmit } from '@src/services/firebase'

const AssessmentPage: NextPage = () => {
  const initialValues: IForm = {
    userInfo: {
      vacinationHistories: [''],
      covidHistories: [{}],
    },
    covidTest: { preTest: [], postTest: [], anxiety: [] },
    progressIndex: 0,
    syndrom: {},
    rateUs: [],
  }

  const onSubmit = async (
    values: IForm,
    formikHelpers: FormikHelpers<IForm>
  ) => {
    console.log('submit', values)
    await formSubmit(values)
    await Swal.fire('Good job!', 'You clicked the button!', 'success')
    formikHelpers.resetForm()
    formikHelpers.setFieldValue('progressIndex', 0)
    location.reload()
  }

  const validationSchema = yup.object().shape({
    userInfo: yup.object().shape({
      fullName: yup.string().required(),
      age: yup.number().required().positive().integer(),
      vacinationHistories: yup.array(yup.string()).required(),
      occupation: yup.string().required(),
      occupationOther: yup.string().notRequired(),
      studentYear: yup.number().min(1).max(4).notRequired(),
      covidHistories: yup
        .array(
          yup.object().shape({
            infectionStart: yup.date().required(),
            infectionEnd: yup.date().required(),
            infectionDuration: yup.number().required().positive().integer(),
            symptoms: yup.string().notRequired(),
          })
        )
        .required(),
    }),
  })

  const renderProgress = (index: number) => {
    const progresses = [
      <Form key={1} />,
      <CovidTest key={2} type="preTest" />,
      <CovidAnxiety key={3} />,
      <CovidAnxietyResult key={4} />,
      <Syndrom key={5} />,
      <CovidTest key={6} type="postTest" />,
      <AnswerCovidTest key={7} />,
      <RatetUs key={8} />,
    ]

    return progresses[index]
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      isInitialValid={false}
    >
      {({ values }) => (
        <Layout title="Life of long COVID-19">
          {renderProgress(values.progressIndex)}
        </Layout>
      )}
    </Formik>
  )
}

const Form = () => {
  const {
    values: { userInfo, progressIndex },
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    errors,
    isValid,
  } = useFormikContext<IForm>()

  const handleAddVacination = () => {
    const vacinationHistories = userInfo?.vacinationHistories || []
    vacinationHistories.push('')
    setFieldValue('userInfo.vacinationHistories', vacinationHistories)
  }

  const handleRemoveVacination = (index: number) => {
    const vacinationHistories = userInfo?.vacinationHistories || []
    vacinationHistories.splice(index, 1)
    setFieldValue('userInfo.vacinationHistories', vacinationHistories)
  }

  const handleSelectVacination = (index: number) => {
    return (value: string) => {
      const vacinationHistories = userInfo?.vacinationHistories || []
      vacinationHistories[index] = value
      setFieldValue('userInfo.vacinationHistories', vacinationHistories)
    }
  }

  const handleAddInfectHistory = () => {
    const covidHistories = userInfo?.covidHistories || []
    covidHistories.push({})
    setFieldValue('userInfo.covidHistories', covidHistories)
  }

  const handleRemoveInfectHistory = (index: number) => {
    const covidHistories = userInfo?.covidHistories || []
    covidHistories.splice(index, 1)
    setFieldValue('userInfo.covidHistories', covidHistories)
  }

  const handleInfetchChange = (index: number, name: keyof ICovidHistory) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const _histories = deepClone(userInfo?.covidHistories || [])
      _histories[index] = {
        ..._histories[index],
        [name]: e.target.value,
      }
      setFieldValue('userInfo.covidHistories', _histories)
    }
  }

  const hasErrors = !!Object.keys(errors.userInfo || {}).length || !isValid

  const hasFieldError = (name: string): boolean => {
    return (
      !!resolvePath(touched, name, false) && !!resolvePath(errors, name, false)
    )
  }

  const handleNext = () => {
    setFieldValue('progressIndex', progressIndex + 1)
    const id = v1()
    setFieldValue('userInfo.uid', id)
    setFieldValue('id', id)
  }

  return (
    <div className="space-y-6">
      <Input
        label="ชื่อ-นามสกุล"
        placeholder="ชื่อ-นามสกุล"
        name="userInfo.fullName"
        onChange={handleChange}
        onBlur={handleBlur}
        value={userInfo?.fullName || ''}
        invalid={hasFieldError('userInfo.fullName')}
      />
      <Input
        label="อายุ"
        placeholder="อายุ"
        type="number"
        name="userInfo.age"
        onChange={handleChange}
        onBlur={handleBlur}
        value={userInfo?.age || ''}
        invalid={hasFieldError('userInfo.age')}
      />

      <div>
        <p className="mb-3">ประวัติการรับวัคซีน</p>
        <FlatList
          className="flex flex-col gap-6"
          data={userInfo?.vacinationHistories || []}
          renderItem={(item, index, list) => (
            <div>
              <div className="flex flex-nowrap items-center gap-x-4">
                <MinusCircleIcon
                  onClick={handleRemoveVacination.bind(null, index)}
                  className={classes(
                    'w-8 cursor-pointer text-red-500',
                    list.length <= 1 && 'pointer-events-none opacity-0'
                  )}
                />

                <p className="w-12 whitespace-nowrap">เข็มที่ {index + 1}</p>
                <Select
                  options={[
                    'Sinovac',
                    'Moderna',
                    'Pfizer',
                    'Sinopharm',
                    'Astrazeneca',
                  ]}
                  value={item}
                  placeholder="ชนิดวัคซีน"
                  onChangeValue={handleSelectVacination(index)}
                />
              </div>
              {index === list.length - 1 && (
                <PlusCircleIcon
                  onClick={handleAddVacination}
                  className="mt-3 w-8 cursor-pointer text-primary"
                />
              )}
            </div>
          )}
        />
      </div>

      <div>
        <p className="mb-3">อาชีพ</p>
        <div className="grid grid-cols-2 gap-6">
          <Select
            placeholder="เลือกอาชีพ"
            options={['นักศึกษา', 'อื่น ๆ']}
            name="userInfo.occupation"
            value={userInfo?.occupation}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {userInfo?.occupation === 'นักศึกษา' && (
            <Select
              placeholder="ชั้นปี"
              options={['1', '2', '3', '4']}
              name="userInfo.studentYear"
              value={userInfo?.studentYear}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}
          {userInfo?.occupation === 'อื่น ๆ' && (
            <Input
              placeholder="ระบุอาชีพ"
              name="userInfo.occupationOther"
              value={userInfo?.occupationOther}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}
        </div>
      </div>

      <div>
        <p className="mb-3">ประวัติการติดเชื้อโควิด</p>
        <div className="space-y-3">
          <FlatList
            className="space-y-3"
            data={userInfo?.covidHistories || []}
            renderItem={(item, index, list) => (
              <>
                <div className="flex items-center gap-3">
                  <MinusCircleIcon
                    onClick={handleRemoveInfectHistory.bind(null, index)}
                    className={classes(
                      'w-8 cursor-pointer text-red-500',
                      list.length <= 1 && 'pointer-events-none opacity-0'
                    )}
                  />
                  <p className="w-12 whitespace-nowrap">ครั้งที่ {index + 1}</p>
                </div>
                <div className="ml-8 space-y-3">
                  <Input
                    label="วันที่ตรวจพบเชื้อ"
                    placeholder="วันที่ตรวจพบเชื้อ"
                    type="date"
                    onChange={handleInfetchChange(index, 'infectionStart')}
                    value={
                      userInfo?.covidHistories?.[
                        index
                      ].infectionStart?.toString() || ''
                    }
                  />
                  <Input
                    label="วันที่ตรวจแล้วไม่พบเชื้อ"
                    placeholder="วันที่ตรวจแล้วไม่พบเชื้อ"
                    type="date"
                    onChange={handleInfetchChange(index, 'infectionEnd')}
                    value={
                      userInfo?.covidHistories?.[
                        index
                      ].infectionEnd?.toString() || ''
                    }
                  />
                  <Input
                    label="ระยะเวลาในการติดเชื้อจนถึงตรวจไม่พบเชื้อ"
                    placeholder="ระยะเวลาในการติดเชื้อจนถึงตรวจไม่พบเชื้อ (วัน)"
                    type="number"
                    onChange={handleInfetchChange(index, 'infectionDuration')}
                    value={
                      userInfo?.covidHistories?.[index].infectionDuration || ''
                    }
                  />
                  <Input
                    label="อาการที่พบขณะติดเชื้อ COVID-19"
                    type="textarea"
                    className="input max-h-56 min-h-[3rem] resize-y"
                    placeholder="อาการที่พบขณะติดเชื้อ COVID-19"
                    onChange={handleInfetchChange(index, 'symptoms')}
                    value={userInfo?.covidHistories?.[index].symptoms || ''}
                  />

                  {index === list.length - 1 && (
                    <PlusCircleIcon
                      onClick={handleAddInfectHistory}
                      className="w-8 cursor-pointer text-primary"
                    />
                  )}
                </div>
              </>
            )}
          />
        </div>
      </div>
      <button
        onClick={handleNext}
        className="btn bg-primary text-white"
        disabled={hasErrors}
      >
        ทำแบบประเมินความรู้เกี่ยวกับ COVID-19
      </button>
    </div>
  )
}

const CovidTest: FC<{ type: 'preTest' | 'postTest' }> = ({ type }) => {
  const [answer, setAnswer] = useState<Record<string, string | number>[]>([])
  const [current, setCurrent] = useState<number>(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const {
    values: { progressIndex },
    setFieldValue,
  } = useFormikContext<IForm>()

  const assessment = useMemo(() => {
    return COVID_TEST[current]
  }, [current])

  const handleSubmit = (choice: IChoice, isDone: boolean) => {
    const newAnswer = [
      ...answer,
      {
        ...choice,
        questionId: COVID_TEST[current].id,
        answer: choice.text,
      },
    ]
    setAnswer(newAnswer)
    if (!isDone) setCurrent(current + 1)
    else {
      const _answer = newAnswer.map((e) => ({
        questionId: e.questionId,
        answer: e.answer,
      }))
      setFieldValue(`covidTest.${type}`, _answer)
      setFieldValue('progressIndex', progressIndex + 1)
    }
  }

  return (
    <div>
      <h3 className="text-center">
        แบบประเมินความรู้เกี่ยวกับ COVID-19 (
        {type === 'preTest' ? 'Pre-test' : 'Post-test'})
      </h3>
      <AssessmentProgress
        question={assessment.question}
        choices={assessment.choices}
        totalCount={COVID_TEST.length}
        current={current + 1}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

const CovidAnxiety = () => {
  const {
    values: { progressIndex },
    setFieldValue,
  } = useFormikContext<IForm>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const [answer, setAnswer] = useState<Record<string, string | number>[]>([])
  const [current, setCurrent] = useState<number>(0)

  const assessment = useMemo(() => {
    return COVID_ANXIETY[current]
  }, [current])

  const handleSubmit = (choice: IChoice, isDone: boolean) => {
    const newAnswer = [
      ...answer,
      { ...choice, questionId: COVID_ANXIETY[current].id, answer: choice.text },
    ]

    setAnswer(newAnswer)
    if (!isDone) setCurrent(current + 1)
    else {
      const _answer = newAnswer.map((e) => ({
        questionId: e.questionId,
        answer: e.answer,
      }))
      setFieldValue('covidTest.anxiety', _answer)
      setFieldValue('progressIndex', progressIndex + 1)
    }
  }

  return (
    <div>
      <h3 className="text-center">แบบประเมินความวิตกกังวลต่อ โควิต-19</h3>
      <AssessmentProgress
        question={assessment.question}
        choices={assessment.choices}
        totalCount={COVID_ANXIETY.length}
        current={current + 1}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

const CovidAnxietyResult = () => {
  const {
    values: { progressIndex, covidTest },
    setFieldValue,
  } = useFormikContext<IForm>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const [assessmentStatus, setAssessmentStatus] = useState({
    ST5: {
      shouldDo: false,
      isDone: false,
      current: 0,
      score: 0,
      answer: [] as Record<string, string | number>[],
    },
    '2Q': {
      shouldDo: false,
      isDone: false,
      current: 0,
      score: 0,
      answer: [] as Record<string, string | number>[],
    },
    '9Q': {
      shouldDo: false,
      isDone: false,
      current: 0,
      score: 0,
      answer: [] as Record<string, string | number>[],
    },
    other: {
      shouldDo: false,
      isDone: false,
    },
  })

  const handleNext = () => {
    setFieldValue('covidTest.anxietyAssessment', assessmentStatus)
    setFieldValue('progressIndex', progressIndex + 1)
  }

  // console.log(covidTest.anxiety)
  const result = calculate(covidTest.anxiety || []).covidAxiety()

  useEffect(() => {
    if (result.criteria === 'heigh') {
      setAssessmentStatus((prev) => ({
        ...prev,
        ST5: {
          shouldDo: true,
          isDone: false,
          current: 0,
          answer: [],
          score: 0,
        },
      }))
      setHasNext(false)
    } else {
      setHasNext(true)
    }
  }, [result.criteria])

  const [showModal, setShowModal] = useState<'ST5' | '2Q' | '9Q' | null>(null)
  const [hasNext, setHasNext] = useState<boolean>(false)

  const handleChnageAssessment = (
    name: 'ST5' | '2Q' | '9Q',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assessment: Record<string, any>,
    next: 'ST5' | '2Q' | '9Q' | 'other',
    choice: IChoice,
    isDone: boolean,
    calculateName: 'ST5' | '_2Q' | '_9Q'
  ) => {
    const { current, answer } = assessmentStatus[name]
    const _assessmentStatus = deepClone(assessmentStatus)
    if (!isDone) {
      _assessmentStatus[name].current = current + 1
      _assessmentStatus[name].answer = [
        ...answer,
        {
          ...choice,
          questionId: assessment[current].id,
          answer: choice.text,
        },
      ]

      setAssessmentStatus(_assessmentStatus)
    } else {
      const newAnswer = [
        ...answer,
        {
          ...choice,
          questionId: assessment[current].id,
          answer: choice.text,
        },
      ]

      _assessmentStatus[name].answer = newAnswer
      _assessmentStatus[name].isDone = true

      setShowModal(null)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { isNext, score } = calculate(newAnswer as any)[calculateName]()

      _assessmentStatus[name].score = score
      setAssessmentStatus(_assessmentStatus)

      if (isNext) {
        _assessmentStatus[next].shouldDo = true
        _assessmentStatus[next].isDone = false
      } else {
        setHasNext(true)
      }
    }
  }

  const getAssessment = (
    name: typeof showModal
  ): {
    current: number
    question: string
    totalCount: number
    choices: IChoice[]
    onSubmit?: (choice: IChoice, isDone: boolean) => void
  } => {
    if (!name) {
      return {
        current: 0,
        question: '',
        choices: [],
        totalCount: 0,
      }
    }

    if (name === 'ST5') {
      const { current } = assessmentStatus[name]
      return {
        current: current + 1,
        totalCount: ST5.length,
        choices: ST5[current].choices,
        question: ST5[current].question,
        onSubmit(choice, isDone) {
          handleChnageAssessment(name, ST5, '2Q', choice, isDone, 'ST5')
        },
      }
    } else if (name === '2Q') {
      const { current } = assessmentStatus[name]
      return {
        current: current + 1,
        totalCount: _2Q.length,
        choices: _2Q[current].choices,
        question: _2Q[current].question,
        onSubmit(choice, isDone) {
          handleChnageAssessment(name, _2Q, '9Q', choice, isDone, '_2Q')
        },
      }
    } else if (name === '9Q') {
      const { current } = assessmentStatus[name]
      return {
        current: current + 1,
        totalCount: _9Q.length,
        choices: _9Q[current].choices,
        question: _9Q[current].question,
        onSubmit(choice, isDone) {
          handleChnageAssessment(name, _9Q, 'other', choice, isDone, '_9Q')
        },
      }
    }

    return {
      current: 0,
      question: '',
      choices: [],
      totalCount: 0,
    }
  }

  return (
    <div>
      <h4 className="mb-6 text-center font-medium">{result.result}</h4>

      {result.criteria === 'low' && (
        <div>
          <p className="font-medium">ส่งเสริมพฤติกรรมการเห็นคุณค่าในตนเอง</p>

          <ol className="list-inside list-decimal space-y-3 leading-relaxed">
            <li>
              ตระหนักรู้คุณลักษณะที่ดีของตนเอง
              มนุษย์ทุกคนมีข้อดีและคุณลักษณะที่ดี ได้แก่ ฉันเป็นคน ซื่อสัตว์
              มีน้ำใจ รับผิดชอบ มองโลกในแง่ดี ใจเย็น เข้มแข็ง จิตใจดี มีเหตุผล
              อัธยาศัยดี อดทน จริงใจ ขยัน
            </li>
            <li>
              เห็นคุณค่าในสิ่งที่มี สิ่งที่มีคุณค่าในชีวิต เช่น สุขภาพดี
              ร่างกายแข็งแรง กินได้ นอนหลับ เป็นต้น
              หากเราหันมาเห็นคุณค่าของสิ่งที่เรามีอยู่ ไม่ว่าจะเป็นสุขภาพร่างกาย
              สุขภาพจิต หรือแม้กระทั้งความรัก ความปรารถนาดี
              มิตรภาพที่ได้รับจากบุคคลที่แวดล้อม
              ชีวิตเราจะมีความสุขมากขึ้นเพราะที่จริงเรามีสิ่งทรงคุณค่ามากมายอยู่แล้ว
            </li>
            <li>
              เมตตาตนเอง ทุกคนต่างมีทั้งข้อดีและข้อเสีย
              ความสมบูรณ์แบบไม่ได้มีอยู่จริง ผู้ที่สมบูรณ์แบบทุกเรื่องไม่มี
              แทนที่จะมาเปรียบเทียบ ตำหนิ ดุด่า ลดคุณค่าตนเอง
              จะดีกว่าหรือไม่หากเราหันมาให้กำลังใจและเมตตาตัวเอง
              “ขอให้เรามีความสุข ขอให้เราได้ใช้ศักยภาพที่มีให้เกิดประโยชน์สูงสุด
              ขอให้เรามีสติ” สิ่งประเสริฐสุดอย่างหนึ่งที่เราสามารถทำได้เองก็คือ
              การมอบความเป็นมิตรให้แก่ตนเอง
            </li>
            <li>
              ตั้งเป้าหมายในชีวิต ซึ่งเป้าหมายเล็กๆ ในชีวิตที่ควรมี ได้แก่
              <ul className="ml-3 list-inside list-disc">
                <li>
                  รักษาสุขภาพ ออกกำลังกายสม่ำเสมอ เลือกกินอาหารที่มีประโยชน์
                  ลดกาแฟและของหวาน นอนหลับพักผ่อนให้เพียงพอ เลิกสูบบุหรี่
                </li>
                <li>
                  ดูแลจิตใจ เติมความสุขให้ตัวเอง
                  ชื่นชมยินดีกับเรื่องเล็กน้อยรอบตัว
                  ปล่อยวางเรื่องที่ทำให้ไม่สบายใจ อยู่กับปัจจุบันอย่างมีสติ
                  พูดคุยกับคนที่มองโลกในแง่ดี
                </li>
                <li>
                  วางแผนการเงิน
                  มีเป้าหมายที่ชัดเจนในการใช้จ่ายอย่างเหมาะสมและรู้จักเก็บออม
                  พัฒนาตนเอง ชีวิต คือ การเรียนรู้ ลองทำกิจกรรมใหม่ๆ เช่น
                  เรียนภาษา ปลูกต้นไม้ ท่องเที่ยว เรียนร้องเพลง
                  ทำกิจกรรมที่น่าสนใจร่วมกับคนอื่น เป็นต้น การเรียนรู้ทักษะใหม่ๆ
                  ช่วยส่งเสริมความรู้สึกมีคุณค่าและเสริมสร้างความมั่นใจ
                </li>
              </ul>
            </li>
            <li>
              ให้เวลากับครอบครัวและคนที่มีความจริงใจกับเรามากขึ้น
              แทนที่จะทุ่มเทเวลาทั้งหมดเพื่อให้ได้มาซึ่งการยอมรับนับถือจากบุคคลอื่น
              ขอให้รักตัวเองและให้เวลากับคนที่พร้อมจะให้กำลังใจเรา
            </li>
          </ol>
        </div>
      )}
      {result.criteria === 'medium' && (
        <div>
          <p className="font-medium">ลองเปลี่ยนวิธีคิด ดังต่อไปนี้</p>
          <ol className="list-inside list-decimal space-y-3 leading-relaxed">
            <li>
              ไม่เปรียบเทียบตนเองกับผู้อื่น เพราะการเปรียบเทียบตนเองกับผู้อื่น
              จะก่อให้เกิดความรู้สึกไม่ดีต่อตนเอง เกิดความกังวล ความเครียด
              หรือรู้สึกว่าตนเองด้อยค่า
              ดังนั้นอาจจะเริ่มจากการปรับทัศนคติและมุมมองว่าตนเองนั้นทำอย่างสุดความสามารถแล้ว
            </li>
            <li>
              ให้อภัยตัวเองสำหรับความผิดพลาด
              เพราะความผิดพลาดมักจะเป็นสาเหตุของความโกรธหรือความรู้สึกแย่
              ซึ่งยิ่งจะเป็นการบั่นทอน ทำให้เกิดความคิดแง่ลบ
              ดังนั้นจึงควรให้อภัยตัวเอง จะช่วยให้จิตใจสงบสุข
            </li>
            <li>
              ตั้งเป้าหมายเล็ก ๆ ในแต่ละวัน เช่น วันนี้ฉันต้องออกกำลังกาย,
              วันนี้ฉันต้องกินข้าวครบ 3 มื้อ หรือวันนี้ฉันต้องนอนเร็ว
              แม้ว่าจะเป็นเป้าหมายเล็ก ๆ แต่การตั้งเป้าหมายเล็ก ๆ นี้เอง
              จะทำให้เราสามารถทำตามเป้าได้สำเร็จ และเกิดเป็นความภูมิใจในตัวเอง
            </li>
            <li>
              กล้าปฏิเสธในสิ่งที่ไม่ต้องการ
              การยอมรับสิ่งที่ไม่ต้องการเปรียบเสมือนการฝืนทำสิ่งใดสิ่งหนึ่ง
              ซึ่งจะส่งผลให้จิตใจของเราหดหู่และเศร้าหมอง
              ดังนั้นจึงควรให้ความสำคัญกับความต้องการตนเองและนึกถึงตนเอง
            </li>
            <li>
              พูดขอบคุณและให้คำชมเล็ก ๆ น้อย ๆ กับตัวเอง ข้อนี้สามารถทำได้ง่าย ๆ
              เช่น ขอบคุณนะ วันนี้เรากินน้ำได้เยอะมาก เก่งที่สุด หรือขอบคุณนะ
              วันนี้เรานำเสนองานได้ดีมาก ๆ เลย
              ซึ่งการพูดขอบคุณและให้คำชมกับตัวเองแบบดังกล่าว
              เป็นอีกหนึ่งวิธีเพิ่มความเชื่อมั่นและความศรัทธาในตนเอง
            </li>
            <li>
              ปรับทัศนคติ มองโลกในแง่บวกให้มากขึ้น การมีทัศนคติหรือมองโลกในแง่ลบ
              ย่อมส่งผลให้ทั้งกับทั้งตัวเราเองและคนรอบข้างรู้สึกแย่
              ดังนั้นจึงควรเริ่มปรับทัศนคติและเปลี่ยนมุมมองใหม่
              จะช่วยลดความวิตกกังวลได้
            </li>
            <li>
              อยู่กับคนที่มอบพลังบวกและความสบายใจ เช่นเดียวกับข้อที่ผ่านมา
              การอยู่กับคนที่มีทัศนคติที่ดี มีพลังบวก
              สามารถพูดคุยหรือขอคำปรึกษาได้ในทุก ๆ เรื่อง
              ย่อมทำให้เราเกิดความสบายใจและมีความสุขในการใช้ชีวิตได้
            </li>
            <li>
              รู้จักแยกแยะระหว่างเรื่องจริงและเรื่องลวง
              เลือกโฟกัสเฉพาะสิ่งที่อยู่ตรงหน้าและปรับทัศนคติต่อเรื่องนั้น ๆ
              เสียใหม่ เช่น เรากังวลว่าจะสอบไม่ผ่าน อาจจะทำให้รู้สึกเครียด กดดัน
              และคิดมาก แต่ถ้าหากเราโฟกัสกับการสอบ
              ปรับทัศนคติว่าเรามีความสามารถมากพอที่จะทำข้อสอบผ่าน
              ก็จะช่วยลดความกังวลและสร้างความสงบในจิตใจได้
            </li>
            <li>
              หางานอดิเรกที่สนใจ หากเป็นงานอดิเรกที่เราสนใจแล้ว
              แน่นอนว่าเราอาจจะสามารถทำได้ดีกว่าการทำสิ่งอื่น ๆ ซึ่งเมื่อทำได้ดี
              ก็อาจจะประสบความสำเร็จ เกิดเป็นความชอบ
              และความภาคภูมิใจในตัวเองในที่สุด
            </li>
            <li>
              เลิกยึดติดกับอดีตหรือความผิดพลาดที่เคยเกิดขึ้น
              การยึดติดกับความผิดพลาดในอดีตจะทำให้เรารู้สึกผิด รู้สึกแย่ตลอดเวลา
              ดังนั้นเราควรเลิกยึดติดกับสิ่งนั้น ๆ แล้วพลิกวิกฤตเป็นโอกาส
              เปลี่ยนสิ่งที่เคยผิดพลาดมาเป็นบทเรียนสำคัญในอนาคต
            </li>
          </ol>
        </div>
      )}
      {result.criteria === 'heigh' && (
        <div className="space-y-3">
          <p>step 1. แนะนำให้ทำ</p>
          {assessmentStatus.ST5.shouldDo && (
            <div>
              <button
                className="mr-3 font-medium text-primary underline underline-offset-2"
                disabled={assessmentStatus.ST5.isDone}
                onClick={() => setShowModal('ST5')}
              >
                แบบประเมิน ST5
              </button>
              <span>
                ซึ่งคำถามต่อไปนี้จะถามถึงประสบการณ์ของท่านในช่วง ระยะ 2-4
                สัปดาห์ที่ผ่านมา ให้ท่านสำรวจตัวท่านเองและประเมินเหตุการณ์
                อาการหรือความคิดเห็นและความรู้สึกของท่านว่าอยู่ในระดับใด
                หากมีคะแนนประเมินมากกว่า 8 คะเเนน
              </span>
            </div>
          )}
          {assessmentStatus['2Q'].shouldDo && (
            <div>
              <button
                className="mr-3 font-medium text-primary underline underline-offset-2"
                disabled={assessmentStatus['2Q'].isDone}
                onClick={() => setShowModal('2Q')}
              >
                ทำแบบคัดกรองซึมเศร้า 2Q
              </button>
              <span>และหากแบบประเมิน2Q มีคะแนนมากกว่า 1 คะแนน</span>
            </div>
          )}
          {assessmentStatus['9Q'].shouldDo && (
            <div>
              <button
                className="mr-3 font-medium text-primary underline underline-offset-2"
                disabled={assessmentStatus['9Q'].isDone}
                onClick={() => setShowModal('9Q')}
              >
                ทำแบบประเมินโรคซึมเศร้า 9Q
              </button>
              <span>ต่อไป หากพบว่า 9Q มีคะแนนรวมมากว่า 7 คะเเนน</span>
            </div>
          )}
          {assessmentStatus.other.shouldDo && (
            <div className="space-y-3">
              <p>
                step 2. แนะนำให้โทรปรึกษา 1323 เพื่อให้คำปรึกษาปัญหาสุขภาพจิต
                เช่น รู้สึกไม่สบายใจ มีปัญหาที่ยังหาทางออกไม่ได้
                หาที่ปรึกษาสำหรับระบายความรู้สึก ชี้เเนะเเนวทาง และให้กำลังใจ
                เป็นต้น
              </p>
              <p>
                step 3.ให้คำแนะนำให้ไปพบแพทย์
                เพื่อเข้ารับการรักษาและดูแลอย่างถูกวิธี
                รวมไปถึงทำกิจกรรมส่งเสริมและฟื้นฟู
              </p>
            </div>
          )}
        </div>
      )}

      <Modal open={!!showModal} onClose={() => setShowModal(null)}>
        <AssessmentProgress {...getAssessment(showModal)} />
      </Modal>
      <button
        className="btn mt-12 bg-primary text-white disabled:bg-opacity-75"
        disabled={!hasNext}
        onClick={handleNext}
      >
        ถัดไป
      </button>
    </div>
  )
}

const Syndrom = () => {
  const {
    values: { syndrom, progressIndex },
    setFieldValue,
  } = useFormikContext<IForm>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const [open, setOpen] = useState<boolean>(false)

  const isActive = (topic: string) => {
    return topic === syndrom.topic
  }

  const handleSelect = (topic: string) => {
    setIsAssessmentDone(false)
    setFieldValue('syndrom.topic', topic)
  }

  const getSyndrom = useMemo(() => {
    return SYNDROMES.find((e) => e.topic === syndrom.topic)
  }, [syndrom.topic])

  const [current, setCurrent] = useState<number>(0)
  const [answer, setAnswer] = useState<Record<string, number | string>[]>([])
  const [isAssessmentDone, setIsAssessmentDone] = useState<boolean>(false)

  const handleSubmit = (choice: IChoice, isDone: boolean) => {
    setIsAssessmentDone(false)
    if (!getSyndrom?.assessment) return
    const newAnswer = [
      ...answer,
      {
        ...choice,
        questionId: getSyndrom.assessment[current].id,
        answer: choice.text,
      },
    ]
    setAnswer(newAnswer)
    if (!isDone) setCurrent(current + 1)
    else {
      const name = `syndrom${getSyndrom.id}`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { score, description } = (calculate(newAnswer as any) as any)[
        name
      ]()
      setFieldValue('syndrom', {
        id: getSyndrom.id,
        topic: getSyndrom.topic,
        score,
        description,
      })
      setIsAssessmentDone(true)
    }
  }

  const handleNext = () => {
    setFieldValue('progressIndex', progressIndex + 1)
  }

  const handleClose = () => {
    setCurrent(0)
    setAnswer([])
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <h2>เลือกกลุ่มอาการ</h2>
      <FlatList
        className="space-y-3"
        data={SYNDROMES}
        renderItem={(syndrom) => (
          <div
            onClick={handleSelect.bind(null, syndrom.topic)}
            className={classes(
              'flex h-16 cursor-pointer items-center justify-center rounded-lg border-2 px-8',
              isActive(syndrom.topic)
                ? 'border-primary font-bold text-primary ring-1 ring-primary'
                : 'border-gray-300'
            )}
          >
            {syndrom.topic}
          </div>
        )}
      />
      <button
        className="btn bg-primary text-lg font-medium text-white"
        disabled={!syndrom.topic}
        onClick={() => setOpen(true)}
      >
        ถัดไป
      </button>
      <Modal open={open} onClose={handleClose}>
        <div className="mt-12 flex h-full flex-col justify-between pb-20">
          {getSyndrom && getSyndrom.assessment ? (
            <>
              {!isAssessmentDone ? (
                <>
                  <div className="">
                    <AssessmentProgress
                      question={getSyndrom.assessment[current].question}
                      choices={getSyndrom.assessment[current].choices}
                      current={current + 1}
                      totalCount={getSyndrom.assessment.length}
                      onSubmit={handleSubmit}
                    />
                  </div>
                </>
              ) : (
                <>
                  <ReactMarkdown className="list-decimal text-lg leading-relaxed">
                    {syndrom.description || ''}
                  </ReactMarkdown>
                  {getSyndrom.topic === 'กลุ่มอาการทั่วไปของร่างกาย' && (
                    <img
                      src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://drive.google.com/file/d/10Wl7gRfhESkXyBD5cgyLyVJZdNqa7a4h/view&choe=UTF-8"
                      className="mt-6 w-full"
                      alt="qrcode"
                    />
                  )}
                  <div className='flex gap-1 justify-center text-xl mb-6'>
                    <p>หรือ</p>
                    <a className='underline' href="https://drive.google.com/file/d/10Wl7gRfhESkXyBD5cgyLyVJZdNqa7a4h/view" target="_blank" rel="noreferrer">
                      คลิกลิงก์
                    </a>
                  </div>
                  <button
                    onClick={handleNext}
                    className="btn bg-primary text-lg text-white"
                  >
                    เสร็จสิ้น
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {/* <ReactMarkdown className="list-decimal text-lg leading-relaxed">
                {getSyndrom?.description || ''}
              </ReactMarkdown> */}
              <div className="space-y-3">
                {JSON.stringify(getSyndrom?.description || '')
                  .replace(/"/g, '')
                  .split('\\n')
                  .map((e, index) => (
                    <div key={index}>{e}</div>
                  ))}
              </div>

              <button
                onClick={handleNext}
                className="btn mt-12 bg-primary text-lg text-white"
              >
                เสร็จสิ้น
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

const AnswerCovidTest = () => {
  const {
    values: { covidTest, progressIndex },
    setFieldValue,
  } = useFormikContext<IForm>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const result = calculate(covidTest.postTest || []).covidTest()

  const getAnswer = (test: typeof COVID_TEST[number]) => {
    return result.answerScore.find((e) => e.questionId === test.id)
  }

  const handleNext = () => {
    setFieldValue('progressIndex', progressIndex + 1)
  }

  return (
    <div>
      <h2 className="mb-6 text-center">
        เฉลยแบบประเมินความรู้เกี่ยวกับ COVID-19
      </h2>
      <h2 className="mb-6 text-center">
        คะแนน: {result.score} / {COVID_TEST.length}
      </h2>
      <FlatList
        className="space-y-5"
        data={COVID_TEST}
        renderItem={(test, index) => (
          <div>
            <h3>
              {index + 1}. {test.question}
            </h3>
            <div className="space-y-1">
              {test.choices.map((choice) => (
                <div key={choice.text} className="ml-3 flex items-center gap-4">
                  {choice.score === 1 ? (
                    <CheckCircleIcon className="w-4 min-w-[1rem] text-primary" />
                  ) : (
                    <XCircleIcon className="w-4 min-w-[1rem] text-red-400" />
                  )}

                  <p
                    className={classes(
                      getAnswer(test)?.answer === choice.text &&
                        `text-lg font-medium underline underline-offset-2 ${
                          getAnswer(test)?.isCorrect
                            ? 'text-green-500'
                            : 'text-red-400'
                        }`
                    )}
                  >
                    {choice.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      />

      <button onClick={handleNext} className="btn mt-12 bg-primary text-white">
        เสร็จสิ้น
      </button>
    </div>
  )
}

const RatetUs = () => {
  const { setFieldValue, ...formik } = useFormikContext<IForm>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const [values, setValues] = useState<Record<string, string | number>[]>([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.id)
    const [questionId, choiceIndex] = e.target.id.split('|')
    const _value = deepClone(values)

    const qIdx = ~~questionId - 1
    const cIdx = ~~choiceIndex

    _value[qIdx] = {
      id: ~~questionId,
      question: RATEUS[qIdx].question,
      answer: RATEUS[qIdx].choices[cIdx].text,
    }
    setValues(_value)
  }

  const handleSubmit = async () => {
    setFieldValue('rateUs', values)
    formik.submitForm()
  }

  const hasErrors = values.length !== RATEUS.length

  return (
    <div>
      <h2>ความพึงพอใจในการนำนวัตกรรมไปใช้</h2>
      <p>
        คำชี้แจง: โปรดใส่เตรื่องหมาย
        ลงในช่องที่ตรงกับความคืดเห็นของท่านมากที่สุด
      </p>
      <div>
        <FlatList
          className="mt-6 space-y-4"
          data={RATEUS}
          renderItem={(item, index) => (
            <div>
              <p>
                {index + 1}. {item.question}
              </p>
              <div className="flex items-center gap-3">
                {item.choices.map((choice, cidx) => (
                  <div key={cidx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`${item.id}`}
                      id={`${item.id}|${cidx}`}
                      onChange={onChange}
                    />
                    <label htmlFor={`${item.id}|${cidx}`}>{choice.text}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        />
        <button
          className="btn mt-12 bg-primary text-white disabled:bg-opacity-75"
          disabled={hasErrors}
          onClick={handleSubmit}
        >
          เสร็จสิ้น
        </button>
      </div>
    </div>
  )
}

export default AssessmentPage
