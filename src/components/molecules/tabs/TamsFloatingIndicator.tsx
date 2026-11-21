import { useState } from 'react'
import { FloatingIndicator, UnstyledButton } from '@mantine/core'
import classes from '#/styles/css/modules/FloatingIndicator.module.css'
import type { Icon } from '@phosphor-icons/react'

type TamsFloatingIndicatorProps = {
  data: {
    label?: string
    value: string
    icon?: Icon
  }[]
  setSelectedItem: (value: string) => void
}

function TamsFloatingIndicator({
  data,
  setSelectedItem,
}: TamsFloatingIndicatorProps) {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({})
  const [active, setActive] = useState(0)

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    controlsRefs[index] = node
    setControlsRefs(controlsRefs)
  }

  const handleClick = (index: number) => {
    setActive(index)
    setSelectedItem(data[index].value)
  }

  const controls = data.map((item, index) => (
    <UnstyledButton
      key={item.value}
      className={classes.control}
      ref={setControlRef(index)}
      onClick={() => handleClick(index)}
      mod={{ active: active === index }}
    >
      <div className={classes.controlLabel}>
        {item?.label}
        {item?.icon && <item.icon />}
      </div>
    </UnstyledButton>
  ))

  return (
    <div className={classes.root} ref={setRootRef}>
      {controls}

      <FloatingIndicator
        target={controlsRefs[active]}
        parent={rootRef}
        className={classes.indicator}
      />
    </div>
  )
}
export default TamsFloatingIndicator
