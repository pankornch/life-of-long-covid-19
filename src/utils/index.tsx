const isValidClass = (className: unknown): boolean => {
  if (className === null || className === false || className === undefined)
    return false
  return true
}

/**
 * inline Class: classes(true && "class1", false && "class2") -> "class1"
 *
 * Object Class: classes({"class1": true, "class2": false}) -> "class1"
 */
export const classes = (...classList: unknown[]) => {
  return classList
    .reduce<string>((acc, curr) => {
      if (!isValidClass(curr)) return acc

      if (typeof curr === 'object') {
        Object.entries(curr as Record<string, string>).forEach(([k, v]) => {
          if (isValidClass(v)) acc += ` ${k}`
        })
      } else if (typeof curr === 'string') acc += ` ${curr}`

      return acc
    }, '')
    .trim()
}

export const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj))

export const resolvePath = (
  object: Record<string, unknown>,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue: any
) => path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), object)

export const dateFormatter = (date?: Date| string) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('th', {
    dateStyle: 'short',
    // timeStyle: 'short',
  }).format(new Date(date))
}
