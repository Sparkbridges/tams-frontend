import { useTamsStore } from '#/lib'
import { Transition } from '@mantine/core'
import { CheckCircleIcon, InfoIcon, XCircleIcon } from '@phosphor-icons/react'
import { useEffect } from 'react'

const TamsToast = () => {
  const { clearToast, opened, data } = useTamsStore((state) => state)

  useEffect(() => {
    if (!opened) return

    const timer = setTimeout(clearToast, 2500)
    return () => clearTimeout(timer)
  }, [opened, data, clearToast])

  const icon =
    data.type === 'success' ? (
      <CheckCircleIcon weight="fill" color="green" />
    ) : data.type === 'error' ? (
      <XCircleIcon weight="fill" color="red" />
    ) : data.type === 'info' ? (
      <InfoIcon weight="fill" color="blue" />
    ) : null
  return (
    <Transition
      mounted={opened}
      transition="fade"
      duration={400}
      timingFunction="ease"
    >
      {(styles) => (
        <div
          className="flex items-center z-50 bg-gray-800 text-white px-3 rounded-md py-1 gap-2 absolute bottom-3 left-1/2"
          style={styles}
        >
          {icon} {data.message}
        </div>
      )}
    </Transition>
  )
}

export default TamsToast
