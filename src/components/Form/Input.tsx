import React, { FC, useEffect, useMemo, useRef } from 'react'

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'] | 'textarea'
  invalid?: boolean
}

const Input: FC<Props> = (props) => {
  const id = useMemo(() => {
    return Date.now().toString(16)
  }, [])

  const As = props.type === 'textarea' ? 'textarea' : 'input'

  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    ref.current?.setCustomValidity(props.invalid ? 'Invalid field.' : '')
  }, [props.invalid])

  return (
    <div className="space-y-3">
      {props.label && <label htmlFor={props.id || id}>{props.label}</label>}
      <As
        id={props.id || (id && props.label)}
        className="input"
        ref={(_ref: unknown) =>
          (ref.current = _ref as HTMLInputElement | HTMLTextAreaElement)
        }
        {...props}
      />
    </div>
  )
}

export default Input
