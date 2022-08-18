import { COVID_ANXIETY, COVID_TEST, ST5, SYNDROMES, _2Q, _9Q } from '@src/data'

interface IAnswer {
  questionId: number
  answer: string
}

export default function calculate(answers: IAnswer[]) {
  return {
    covidTest() {
      let score = 0
      const answerScore = answers.map((ans) => {
        const isCorrect = !!COVID_TEST.find(
          (e) =>
            ans.questionId === e.id &&
            ans.answer === e.choices[e.correctAnswerIndex].text
        )

        if (isCorrect) score++

        return {
          ...ans,
          isCorrect,
        }
      })

      return {
        score,
        answerScore,
      }
    },
    covidAxiety() {
      const score = answers.reduce((acc, ans) => {
        const score =
          COVID_ANXIETY.find((e) => e.id === ans.questionId)?.choices.find(
            (e) => e.text === ans.answer
          )?.score || 0
        return acc + score
      }, 0)

      let result: string
      let criteria: 'low' | 'medium' | 'heigh'

      if (score >= 5 && score <= 6) {
        result = 'มีความกังวลระดับต่ำ'
        criteria = 'low'
      } else if (score >= 7 && score <= 11) {
        result = 'มีความกังวลระดับปานกลาง'
        criteria = 'medium'
      } else {
        result = 'มีความกังวลระดับสูง'
        criteria = 'heigh'
      }

      return { score, result, criteria }
    },
    ST5() {
      const score = answers.reduce((acc, ans) => {
        const score =
          ST5.find((e) => e.id === ans.questionId)?.choices.find(
            (e) => e.text === ans.answer
          )?.score || 0

        return acc + score
      }, 0)

      const isNext = score > 8

      return { score, isNext }
    },
    _2Q() {
      const score = answers.reduce((acc, ans) => {
        const score =
          _2Q
            .find((e) => e.id === ans.questionId)
            ?.choices.find((e) => e.text === ans.answer)?.score || 0
        return acc + score
      }, 0)

      const isNext = score > 1

      return {
        score,
        isNext,
      }
    },
    _9Q() {
      const score = answers.reduce((acc, ans) => {
        const score =
          _9Q
            .find((e) => e.id === ans.questionId)
            ?.choices.find((e) => e.text === ans.answer)?.score || 0
        return acc + score
      }, 0)

      const isNext = score > 7

      return {
        score,
        isNext,
      }
    },
    syndrom1() {
      const score = answers.reduce((acc, ans) => {
        const score =
          SYNDROMES[0].assessment
            ?.find((e) => e.id === ans.questionId)
            ?.choices.find((e) => e.text === ans.answer)?.score || 0
        return acc + score
      }, 0)
      return {
        score,
        description: `อาการอ่อนเพลีย/อ่อนล้า เป็นอาการที่พบได้บ่อยหลังภาวะการติดเชื้อ COVID-19 โดยพบที่
        4-7 สัปดาห์ ร้อยละ 23 ที่ 8-11 สัปดาห์ ร้อยละ 42 ที่ 12-15 สัปดาห์ ร้อยละ 26 และ ที่ 16-20 สัปดาห์
        ร้อยละ 23 รวมทั้งเมื่อติดตามอาการต่อเนื่องจนถึงสัปดาห์ที่ 28 ซึ่งพบร้อยละ 32 จะเห็นได้ว่าผู้ป่วย
        จะมีอาการมากที่สุดในช่วง 8-11 สัปดาห์ หลังจากนั้นจะมีอาการน้อยลง แต่ยังคงมีอาการต่อเนื่องได้จนถึง
        สัปดาห์ที่ 28`,
      }
    },
    syndrom3() {
      const score = answers.reduce((acc, ans) => {
        const score =
          SYNDROMES[2].assessment
            ?.find((e) => e.id === ans.questionId)
            ?.choices.find((e) => e.text === ans.answer)?.score || 0
        return acc + score
      }, 0)

      let description: string

      if (score <= 9)
        description =
          'ท่านมีความวิตกกังวลในระดับเฉลี่ยหรือสูงกว่าเกณฑ์เฉลี่ย เพียงเล็กน้อย'
      else if (score <= 14)
        description =
          'ท่านมีความวิตกกังวลในระดับปานกลาง และควรทำแบบประเมินซ้้าในอีก 1-2 สัปดาห์'
      else
        description =
          'ท่านมีความวิตกกังวลในระดับสูง ควรได้รับการประเมินจากผู้เชี่ยวชาญ'

      return {
        score,
        description: description,
      }
    },
  }
}
