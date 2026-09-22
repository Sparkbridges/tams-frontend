
import { WarningCircleIcon } from '@phosphor-icons/react'

const TamsBanner = () => {
  return (
    <div className="bg-secondary/10 flex items-center gap-5 rounded-md p-3">
      <WarningCircleIcon weight="fill" size={20} />
      <p className="text-sm">
        All fields and sections marked (<span className="text-red-500">*</span>)
        are compulsory to fill
      </p>
    </div>
  )
}

export default TamsBanner
