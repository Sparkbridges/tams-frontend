import { useState } from 'react'
import { Anchor, Text } from '@mantine/core'
import { useApplicantDocumentUrl } from '#/lib/api/services/ats'
import {
  applicantDocumentPath,
  safeApplicantUrl,
} from '#/lib/utils/applicantAnswers'
import { getErrorMessage } from '#/lib/utils'

export default function RecruitmentApplicantDocumentLink({
  url,
  children,
}: {
  url: string
  children: React.ReactNode
}) {
  const signer = useApplicantDocumentUrl()
  const [error, setError] = useState('')
  const open = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    let path: string | null
    try {
      path = applicantDocumentPath(url)
    } catch (cause) {
      event.preventDefault()
      setError(getErrorMessage(cause))
      return
    }
    if (path === null) return
    event.preventDefault()
    if (signer.isPending) return
    setError('')
    const popup = window.open('about:blank', '_blank')
    if (!popup) {
      setError('Please allow popups to open this document.')
      return
    }
    popup.opener = null
    try {
      const response = await signer.mutateAsync(path)
      const signed = safeApplicantUrl(response.data)
      if (!signed || !signed.startsWith('https://'))
        throw new Error('Unable to retrieve a valid document URL.')
      if (!popup.closed) popup.location.replace(signed)
    } catch (cause) {
      popup.close()
      setError(getErrorMessage(cause))
    }
  }
  return (
    <>
      <Anchor
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={open}
        aria-busy={signer.isPending}
      >
        {signer.isPending ? 'Opening document...' : children}
      </Anchor>
      {error && (
        <Text role="alert" c="red" size="sm">
          {error}
        </Text>
      )}
    </>
  )
}
