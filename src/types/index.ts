export interface ICovidHistory {
  infectionStart?: Date
  infectionEnd?: Date
  infectionDuration?: number
  symptoms?: string
}

export interface IAnswer {
  questionId: number
  answer: string
}

export interface IChoice {
  text: string
  score: number
}

export interface IForm {
  id?: string
  userInfo: {
    uid?: string
    fullName?: string
    age?: number
    vacinationHistories?: string[]
    occupation?: string
    occupationOther?: string
    studentYear?: number
    covidHistories?: ICovidHistory[]
  }
  covidTest: {
    preTest?: IAnswer[]
    postTest?: IAnswer[]
    anxiety?: IAnswer[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    anxietyAssessment?: Record<string, any>
  }
  progressIndex: number
  syndrom: {
    id?: number
    topic?: string
    score?: number
    description?: string
  }
  rateUs: {
    id?: number
    question?: string
    answer?: string
  }[]
  createdAt?: Date
}

export enum ECollection {
  FORMS = 'Forms',
  USERS = 'Users',
}

export enum ERole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}
