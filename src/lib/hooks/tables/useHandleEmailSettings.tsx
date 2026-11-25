import {
  useRecruitmentEmailTemplateById,
  useRecruitmentEmailTemplates,
  useRecruitmentSettings,
  useUpdateRecruitmentEmailTemplateById,
  useUpdateRecruitmentSettings,
} from '#/lib/api/services/recruitment'
import { normalizeStrings } from '#/lib/utils'
import { useEffect, useMemo, useState } from 'react'

const useHandleEmailSettings = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    number | undefined
  >()

  const [selectedTemplateForm, setSelectedTemplateForm] = useState<{
    subject: string
    body: string
  }>({ subject: '', body: '' })

  const [recruitmentSettings, setRecruitmentSettings] = useState<{
    accepted_formats: string[]
    max_file_size_mb: number
  }>({
    accepted_formats: [],
    max_file_size_mb: 0,
  })

  const { data, isLoading: isLoadingTemplates } = useRecruitmentEmailTemplates()

  const { data: selectedTemplateData, isLoading: isLoadingDetails } =
    useRecruitmentEmailTemplateById(selectedTemplateId as number)

  const { data: recruitmentSettingsData } = useRecruitmentSettings()

  const mutateAsyncUpdateRecruitmentEmailTemplateById =
    useUpdateRecruitmentEmailTemplateById()

  const mutateAsyncUpdateRecruitmentSettings = useUpdateRecruitmentSettings()

  const handleUpdateRecruitmentEmailTemplateById = async () => {
    try {
      await mutateAsyncUpdateRecruitmentEmailTemplateById.mutateAsync({
        templateId: selectedTemplateId as number,
        ...selectedTemplateForm,
      })
    } catch (error) {
      console.error('Failed to update recruitment email template:', error)
    }
  }

  const handleUpdateRecruitmentSettings = async () => {
    try {
      await mutateAsyncUpdateRecruitmentSettings.mutateAsync(
        recruitmentSettings,
      )
    } catch (error) {
      console.error('Failed to update recruitment settings:', error)
    }
  }

  useEffect(() => {
    if (
      Array.isArray(data?.data.templates) &&
      data?.data.templates.length > 0 &&
      !selectedTemplateId
    ) {
      setSelectedTemplateId(data?.data.templates[0].id)
    }
  }, [data?.data.templates])

  const columns = useMemo(() => {
    return data?.data.templates.map((template) => ({
      value: template.id.toString(),
      label: normalizeStrings(template.template_type, 'capitalize'),
    }))
  }, [data?.data.templates])

  useEffect(() => {
    if (selectedTemplateData?.data.template) {
      setSelectedTemplateForm({
        subject: selectedTemplateData.data.template.subject,
        body: selectedTemplateData.data.template.body,
      })
    }
  }, [selectedTemplateData])

  useEffect(() => {
    if (recruitmentSettingsData?.data) {
      setRecruitmentSettings({
        accepted_formats: JSON.parse(
          recruitmentSettingsData.data.accepted_formats,
        ) as string[],
        max_file_size_mb: recruitmentSettingsData.data.max_file_size_mb,
      })
    }
  }, [recruitmentSettingsData, setRecruitmentSettings])

  return {
    recruitmentSettings,
    columns,
    setSelectedTemplateId,
    selectedTemplateData,
    selectedTemplateForm,
    setSelectedTemplateForm,
    isLoadingDetails,
    isLoadingTemplates,
    handleUpdateRecruitmentEmailTemplateById,
    setRecruitmentSettings,
    isUpdating: mutateAsyncUpdateRecruitmentEmailTemplateById.isPending,
    isUpdatingSettings: mutateAsyncUpdateRecruitmentSettings.isPending,
    handleUpdateRecruitmentSettings,
    isDirty:
      selectedTemplateForm.subject !==
        selectedTemplateData?.data.template.subject ||
      selectedTemplateForm.body !== selectedTemplateData?.data.template.body,
    isDirtySettings:
      JSON.stringify(recruitmentSettings.accepted_formats).length !==
        recruitmentSettingsData?.data.accepted_formats.length ||
      recruitmentSettings.max_file_size_mb !==
        recruitmentSettingsData?.data.max_file_size_mb,
  }
}

export default useHandleEmailSettings
