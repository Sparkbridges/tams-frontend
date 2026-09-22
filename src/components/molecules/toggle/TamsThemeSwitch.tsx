import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core'
import { SunIcon, MoonIcon } from '@phosphor-icons/react'
import cx from 'clsx'
import classes from '@/styles/css/modules/Switch.module.css'

function TamsThemeSwitch() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  })

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
      }
      variant="default"
      size="md"
      aria-label="Toggle color scheme"
    >
      <SunIcon className={cx(classes.icon, classes.light)} />
      <MoonIcon className={cx(classes.icon, classes.dark)} />
    </ActionIcon>
  )
}

export default TamsThemeSwitch
