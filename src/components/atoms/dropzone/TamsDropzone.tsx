import {
  UploadSimpleIcon,
  ImageIcon,
  XIcon,
  SealCheckIcon,
  TrashIcon,
  DotIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import type { DropzoneProps, FileWithPath } from '@mantine/dropzone'
import { ActionIcon, Badge, Group, Paper, Text, ThemeIcon } from '@mantine/core'
import { millifyValue } from '#/lib'

type TamsDropzoneProps = Partial<DropzoneProps> & {
  onDrop?: (files: FileWithPath[]) => void
  onReject?: (files: FileWithPath[]) => void
  accept?: string[]
  maxSize?: number
  title?: string
  description?: string
  loading?: boolean
  disabled?: boolean
  icon?: Icon
  error?: string
  value?: FileWithPath[] | string[]
  status?: 'idle' | 'uploading' | 'uploaded'
  additionalText?: string
  onremove?: (file: FileWithPath | string) => void
}
const TamsDropzone = (props: TamsDropzoneProps) => {
  return (
    <div>
      <Dropzone
        loading={props.loading}
        disabled={props.disabled}
        onDrop={
          props.onDrop ?? ((files) => console.log('accepted files', files))
        }
        onReject={
          props.onReject ?? ((files) => console.log('rejected files', files))
        }
        maxSize={props.maxSize ?? 5 * 1024 ** 2}
        accept={props.accept ?? IMAGE_MIME_TYPE}
        {...props}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: 'none' }}
        >
          <Dropzone.Accept>
            <UploadSimpleIcon size={52} color="var(--mantine-color-blue-6)" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <XIcon size={52} color="var(--mantine-color-red-6)" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            {props.icon ? (
              <props.icon size={52} color="var(--mantine-color-dimmed)" />
            ) : (
              <ImageIcon size={52} color="var(--mantine-color-dimmed)" />
            )}
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              {props.title ?? 'Drag images here or click to select files'}
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              {props.description ??
                'Attach as many files as you like, each file should not exceed 5mb'}
            </Text>
            {props.error && (
              <Text size="sm" c="red" inline mt={7}>
                {props.error}
              </Text>
            )}
          </div>
        </Group>
      </Dropzone>

      <section className="mt-4">
        {props.value?.map((file) => {
          if (typeof file === 'string')
            return (
              <Paper
                p={'md'}
                withBorder
                shadow="md"
                radius={'md'}
                key={file}
                className="flex gap-4"
              >
                <ThemeIcon variant="light" color="green">
                  <SealCheckIcon size={32} />
                </ThemeIcon>
                <div className='flex items-center gap-3'>
                  <img src={file} alt={file} className="w-10 h-10 object-cover rounded-md mb-2" />
                  <h4 className="font-semibold text-md">{file.slice(0, 40)}...</h4>
                </div>
                <div className="ml-auto">
                  <ActionIcon
                    color="red"
                    variant="light"
                    size="sm"
                    onClick={() => props.onremove?.(file)}
                  >
                    <TrashIcon size={32} />
                  </ActionIcon>
                </div>
              </Paper>
            )
          return (
            <Paper
              p={'md'}
              withBorder
              shadow="md"
              radius={'md'}
              key={file.name}
              className="flex gap-4 overflow-hidden"
            >
              <ThemeIcon variant="light" color="green">
                <SealCheckIcon size={32} />
              </ThemeIcon>
              <div>
                <div className="flex items-center gap-2 overflow-hidden">
                  <h4 className="font-semibold overflow-hidden text-md">{file.name}</h4>
                  {props.status === 'uploaded' && (
                    <Badge variant="light" color="green">
                      Ready to map
                    </Badge>
                  )}
                </div>

                <div className="text-gray-600 text-xs font-semibold flex items-center gap-1">
                  <span>{millifyValue(file.size, 'bytes')}</span>

                  {props.additionalText && (
                    <>
                      <DotIcon size={12} />
                      <span>{props.additionalText}</span>
                    </>
                  )}
                  <DotIcon weight="fill" size={12} />
                  <span>{file.type}</span>
                </div>
              </div>
              <div className="ml-auto">
                <ActionIcon
                  color="red"
                  variant="light"
                  size="sm"
                  onClick={() => props.onremove?.(file)}
                >
                  <TrashIcon size={32} />
                </ActionIcon>
              </div>
            </Paper>
          )
        })}
      </section>
    </div>
  )
}

export default TamsDropzone
