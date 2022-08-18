import React from 'react'

interface Props<T> {
  data: T[]
  renderItem: (item: T, index: number, data: T[]) => React.ReactNode
  className?: string
}

const FlatList = <T,>(props: Props<T>) => {
  return (
    <ul className={props.className}>
      {props.data.map((item, index) => {
        const child = props.renderItem(item, index, props.data)
        return <ul key={index}>{child}</ul>
      })}
    </ul>
  )
}

export default FlatList
