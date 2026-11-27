import { z } from 'zod'
import useTamsForm from '../useTamsForm'
import { useSaveScreeningRequirements } from '#/lib/api/services/ats'
import type { TScreeningRequirements } from '#/lib/types/api/ats'

const terms = z.array(z.string().trim().min(1).max(100)).max(30)
const schema = z.object({
  required_skills: terms,
  preferred_skills: terms,
  qualifications: terms,
  minimum_years_experience: z.number().min(0).max(60).nullable(),
})

export default function useAtsRequirementsForm(
  id: number,
  initial: TScreeningRequirements,
  onClose: () => void,
) {
  const form = useTamsForm({ schema, defaultValues: initial })
  const mutation = useSaveScreeningRequirements()
  const onSubmit = form.onSubmit(async () => {
    try {
      await mutation.mutateAsync({ id, ...form.getValues() })
      onClose()
    } catch (error) {
      console.error('Unable to save screening requirements', error)
    }
  })
  return { form, onSubmit, mutation }
}
