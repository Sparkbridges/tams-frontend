import {
  TamsButton,
  TamsMultiSelect,
  TamsNumberInput,
  TamsSideNavTable,
  TamsSpinner,
  TamsTextArea,
  TamsTextInput,
} from '#/components/atoms'
import { useHandleEmailSettings } from '#/lib'
import { Divider, LoadingOverlay, Paper, Tooltip } from '@mantine/core'

const RecruitmentEmailSettings = () => {
  const {
    columns,
    setSelectedTemplateId,
    selectedTemplateForm,
    selectedTemplateData,
    isLoadingDetails,
    handleUpdateRecruitmentEmailTemplateById,
    isDirty,
    setSelectedTemplateForm,
    isUpdating,
    recruitmentSettings,
    setRecruitmentSettings,
    handleUpdateRecruitmentSettings,
    isUpdatingSettings,
    isDirtySettings,
    isLoadingTemplates,
  } = useHandleEmailSettings()
  return (
    <div>
      <TamsSideNavTable
        title="Email Settings"
        columnData={columns}
        loading={isLoadingTemplates}
        actions={
          <div className="flex gap-3 items-center">
            <TamsButton radius="xl" size="md" variant="light" color="t-purple">
              Preview
            </TamsButton>
            <TamsButton
              loading={isUpdating}
              disabled={!isDirty}
              size="md"
              radius="xl"
              onClick={handleUpdateRecruitmentEmailTemplateById}
            >
              Save
            </TamsButton>
          </div>
        }
        setSelectedId={setSelectedTemplateId}
        content={
          <section className="py-3 px-6 space-y-5 relative">
            <LoadingOverlay
              visible={isLoadingDetails}
              loaderProps={{ children: <TamsSpinner size={32} /> }}
            />
            <TamsTextInput
              label="Template Subject"
              value={selectedTemplateForm?.subject ?? ''}
              onChange={(e) =>
                setSelectedTemplateForm((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
            />
            <TamsTextArea
              label="Template Body"
              autosize
              minRows={10}
              value={selectedTemplateForm?.body ?? ''}
              onChange={(e) =>
                setSelectedTemplateForm((prev) => ({
                  ...prev,
                  body: e.target.value,
                }))
              }
            />
            <Divider
              my="md"
              label="Placeholders Selections"
              labelPosition="center"
            />
            <div className="flex gap-2 items-center flex-wrap py-3">
              {selectedTemplateData?.data?.placeholders?.map((placeholder) => (
                <Tooltip
                  key={placeholder.key}
                  label={placeholder.description}
                  refProp="rootRef"
                >
                  <div className="px-3 py-1 text-sm rounded-xl bg-primary-500/10 shadow">
                    {placeholder.key}
                  </div>
                </Tooltip>
              ))}
            </div>
          </section>
        }
      />

      <Divider my="xl" />
      <Paper withBorder className="grid gap-4 md:grid-cols-2 grid-cols-1 p-5">
        <div>
          <h1 className="text-xl font-bold">Candidate CV Standard</h1>
          <p>
            Define accepted resume format and optional CV template for
            candidates. This information is displayed in the ATS import flow
            before upload starts.
          </p>
        </div>
        <div className="space-y-5">
          <TamsMultiSelect
            label="Accepted CV Formats"
            value={recruitmentSettings.accepted_formats}
            onChange={(value) =>
              setRecruitmentSettings((prev) => ({
                ...prev,
                accepted_formats: value,
              }))
            }
            data={['pdf', 'docx']}
          />
          <TamsNumberInput
            allowNegative={false}
            allowDecimal={false}
            value={recruitmentSettings.max_file_size_mb}
            onChange={(value) =>
              setRecruitmentSettings((prev) => ({
                ...prev,
                max_file_size_mb: Number(value),
              }))
            }
          />
          <TamsButton
            radius="xl"
            size="md"
            className="ml-auto block"
            loading={isUpdatingSettings}
            disabled={!isDirtySettings}
            onClick={handleUpdateRecruitmentSettings}
          >
            Update
          </TamsButton>
        </div>
      </Paper>
    </div>
  )
}

export default RecruitmentEmailSettings
