import { classes } from 'src/utils'
import { ChevronDownIcon } from '@heroicons/react/solid'
import React, { FC, useEffect, useState } from 'react'

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[]
  onChangeValue?: (option: string) => void
}

const Select: FC<Props> = ({
  options,
  onChange,
  onChangeValue,
  placeholder,
  value,
  ...props
}) => {
  const [selected, setSelected] = useState<string>()
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const _value = options.find((option) => option === e.target.value) || ''
    setSelected(_value)
    onChange?.call(null, e)
    onChangeValue?.call(null, _value)
  }

  useEffect(() => {
    setSelected(value ? value.toString() : '')
  }, [value])

  return (
    <div className="input relative flex w-auto grow">
      <select
        {...props}
        onChange={handleChange}
        value={selected || ''}
        className={classes(
          'grow outline-none',
          selected ? 'text-black' : 'text-gray-400'
        )}
      >
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2 w-6" />
    </div>
  )
}

export default Select
