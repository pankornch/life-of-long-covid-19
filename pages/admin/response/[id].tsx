/* eslint-disable @typescript-eslint/no-explicit-any */
import FlatList from '@components/FlatList'
import Navbar from '@components/Navbar'
import {
  CheckCircleIcon,
  RefreshIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import { COVID_TEST } from '@src/data'
import { getResponseById } from '@src/services/firebase'
import { IForm } from '@src/types'
import { classes, dateFormatter } from '@src/utils'
import calculate from '@src/utils/calculate'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const ResponseByIdPage = () => {
  const router = useRouter()

  const [response, setResponse] = useState<Partial<IForm>>({})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!router.query.id) return
    setLoading(true)
    getResponseById(router.query.id as string).then((data) => {
      setResponse(data as any)
      setLoading(false)
    })
  }, [router.query.id])

  const resultPreTest = calculate(
    response?.covidTest?.preTest || []
  ).covidTest()
  const resultPostTest = calculate(
    response?.covidTest?.postTest || []
  ).covidTest()

  const getAnswer = (result: any, test: typeof COVID_TEST[number]) => {
    return result.answerScore.find((e: any) => e.questionId === test.id)
  }

  const resultCovidAnxity = calculate(
    response?.covidTest?.anxiety || []
  ).covidAxiety()

  return (
    <div>
      <div className="bg-primary">
        <Navbar title="Life of long COVID-19" />
      </div>
      <div className="container mt-12 space-y-12 divide-y-2 pb-12">
        {loading ? (
          <RefreshIcon className="mx-auto w-12 animate-spin" />
        ) : (
          <>
            <h3 className="text-center">ผลการทำแบบประเมิน</h3>
            <div className="space-y-3 pt-2">
              <h4>ข้อมูลทั่วไป</h4>
              <div className="space-y-3">
                <p>
                  ชื่อ-นามสกุล:
                  <div className="input">{response?.userInfo?.fullName}</div>
                </p>
                <p>
                  อายุ:
                  <div className="input">{response?.userInfo?.age}</div>
                </p>
                <p>
                  อาชีพ: {response?.userInfo?.occupation}{' '}
                  {response?.userInfo?.occupation === 'นักศึกษา'
                    ? `ชั้นปี ${response?.userInfo.studentYear}`
                    : response?.userInfo?.occupationOther}
                </p>
                <div>
                  ประวัติการรับวัคซีน
                  <FlatList
                    className="ml-3"
                    data={response.userInfo?.vacinationHistories || []}
                    renderItem={(item, index) => (
                      <p>
                        เข็มที่ {index + 1}:<div className="input">{item}</div>
                      </p>
                    )}
                  />
                </div>
                <div>
                  ประวัติการติดเชื้อโควิด
                  <FlatList
                    className="ml-3"
                    data={response.userInfo?.covidHistories || []}
                    renderItem={(item, index) => (
                      <div>
                        <p>ครั้งที่ {index + 1}</p>
                        <div className="ml-3 space-y-3">
                          <p>
                            วันที่ตรวจพบเชื้อ:
                            <div className="input">
                              {dateFormatter(item.infectionStart)}
                            </div>
                          </p>
                          <p>
                            วันที่ตรวจแล้วไม่พบเชื้อ:
                            <div className="input">
                              {dateFormatter(item.infectionEnd)}
                            </div>
                          </p>
                          <p>
                            ระยะเวลา:
                            <div className="input">
                              {item.infectionDuration}
                            </div>
                          </p>
                          <p>
                            อาการที่พบ:
                            <div className="input">{item.symptoms || '-'}</div>
                          </p>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <h4>แบบประเมินความรู้เกี่ยวกับ COVID-19 Pre-test</h4>
              <p>
                คะแนน <div className="input">{resultPreTest.score}</div>
              </p>
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
                        <div
                          key={choice.text}
                          className="ml-3 flex items-center gap-4"
                        >
                          {choice.score === 1 ? (
                            <CheckCircleIcon className="w-4 min-w-[1rem] text-primary" />
                          ) : (
                            <XCircleIcon className="w-4 min-w-[1rem] text-red-400" />
                          )}

                          <p
                            className={classes(
                              getAnswer(resultPreTest, test)?.answer ===
                                choice.text &&
                                `text-lg font-medium underline underline-offset-2 ${
                                  getAnswer(resultPreTest, test)?.isCorrect
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
            </div>
            <div className="space-y-3 pt-2">
              <h4>แบบประเมินความวิตกกังวลต่อ โควิต-19</h4>
              <div className="space-y-3">
                <p>
                  คะแนน <div className="input">{resultCovidAnxity.score}</div>
                </p>
                <p>
                  ความกังวล{' '}
                  <div className="input">{resultCovidAnxity.result}</div>
                </p>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <h4>
                กลุ่มอาการ
                <div className="input">{response.syndrom?.topic}</div>
                {response.syndrom?.score && (
                  <p>
                    คะแนน <div className="input">{response.syndrom.score}</div>
                  </p>
                )}
              </h4>
            </div>
            <div className="space-y-3 pt-2">
              <h4>แบบประเมินความรู้เกี่ยวกับ COVID-19 Post-test</h4>
              <p>
                คะแนน <div className="input">{resultPostTest.score}</div>
              </p>
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
                        <div
                          key={choice.text}
                          className="ml-3 flex items-center gap-4"
                        >
                          {choice.score === 1 ? (
                            <CheckCircleIcon className="w-4 min-w-[1rem] text-primary" />
                          ) : (
                            <XCircleIcon className="w-4 min-w-[1rem] text-red-400" />
                          )}

                          <p
                            className={classes(
                              getAnswer(resultPostTest, test)?.answer ===
                                choice.text &&
                                `text-lg font-medium underline underline-offset-2 ${
                                  getAnswer(resultPostTest, test)?.isCorrect
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
            </div>
            <div className="space-y-3 pt-2">
              <h4>ความพึงพอใจในการนำนวัตกรรมไปใช้</h4>
              <FlatList
                data={response.rateUs || []}
                className="space-y-3"
                renderItem={(item, index) => (
                  <div>
                    <p>
                      {index + 1} {item.question}
                    </p>
                    <b>ตอบ: {item.answer}</b>
                  </div>
                )}
              />
            </div>
          </>
        )}
        <Link href="/admin">
          <button className="btn bg-primary text-white">ย้อนกลับ</button>
        </Link>
      </div>
    </div>
  )
}

export default ResponseByIdPage
