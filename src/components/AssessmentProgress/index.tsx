import FlatList from '@components/FlatList'
// import { ChevronLeftIcon } from '@heroicons/react/solid'
import { classes } from '@src/utils'
import React, { FC, useMemo, useState } from 'react'

interface IChoice {
  text: string
  score: number
}

interface Props {
  question: string
  choices: IChoice[]
  totalCount: number
  current: number
  value?: IChoice
  onSubmit?: (choice: IChoice, isDone: boolean) => void
}

const AssessmentProgress: FC<Props> = ({
  question,
  totalCount,
  current,
  choices,
  value,
  onSubmit,
}) => {
  const [select, setSelect] = useState<IChoice | null>(value || null)

  const isActive = (choice: IChoice) => {
    return choice.text === select?.text
  }

  const isDone = useMemo(() => {
    return current === totalCount
  }, [current, totalCount])
  const handleChange = (choice: IChoice) => {
    setSelect(choice)
  }

  const handleSubmit = () => {
    onSubmit?.call(null, select!, isDone)
    setSelect(null)
  }

  return (
    <div className="flex grow flex-col">
      <div>
        <div>
          <div className="relative flex h-16 items-center">
            {/* <ChevronLeftIcon className="absolute left-0 w-12" /> */}
            <p className="mx-auto text-lg font-medium">
              {current} / {totalCount}
            </p>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: (current / totalCount) * 100 + '%' }}
          ></div>
        </div>
      </div>

      <h2 className="mb-12 mt-6">{question}</h2>
      <div className="flex grow flex-col justify-between">
        <FlatList
          className="space-y-3"
          data={choices}
          renderItem={(choice) => (
            <div
              onClick={handleChange.bind(null, choice)}
              className={classes(
                'flex min-h-[4rem] cursor-pointer items-center justify-center rounded-lg border-2 px-8 py-2',
                isActive(choice)
                  ? 'border-primary font-bold text-primary ring-1 ring-primary'
                  : 'border-gray-300'
              )}
            >
              {choice.text}
            </div>
          )}
        />
        <button
          onClick={handleSubmit}
          className="btn mt-12 bg-primary py-4 text-xl font-bold text-white disabled:cursor-not-allowed disabled:bg-opacity-50"
          disabled={!select}
        >
          {isDone ? 'ส่งแบบประเมิน' : 'ถัดไป'}
        </button>
      </div>
    </div>
  )
}

export default AssessmentProgress
