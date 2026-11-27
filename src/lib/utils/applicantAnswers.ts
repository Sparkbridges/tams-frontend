export function safeApplicantUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null
  } catch (error) {
    if (!(error instanceof TypeError)) throw error
    return null
  }
}

export function applicantDocumentPath(value: string): string | null {
  const url = new URL(value)
  if (
    [
      'storage.googleapis.com',
      'www.googleapis.com',
      'firebasestorage.googleapis.com',
    ].includes(url.hostname)
  ) {
    const api = url.pathname.match(
      /^\/(?:download\/)?(?:storage\/v1|v0)\/b\/[^/]+\/o\/(.+)$/,
    )
    if (api) return decodeURIComponent(api[1])
  }
  if (
    ['storage.googleapis.com', 'storage.cloud.google.com'].includes(
      url.hostname,
    )
  ) {
    return decodeURIComponent(url.pathname.split('/').slice(2).join('/'))
  }
  if (url.hostname.endsWith('.storage.googleapis.com'))
    return decodeURIComponent(url.pathname.slice(1))
  return null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export function applicantAnswers(
  value: unknown,
): { question: string; value: unknown }[] {
  if (value === null || value === undefined || value === '') return []
  const parsed: unknown = typeof value === 'string' ? JSON.parse(value) : value
  if (!Array.isArray(parsed))
    throw new Error('Unsupported application answer format')
  return parsed.map((answer: unknown, index) => {
    if (!isRecord(answer))
      return { question: `Answer ${index + 1}`, value: answer }
    const question = answer.question ?? answer.label ?? answer.field
    return {
      question: typeof question === 'string' ? question : `Answer ${index + 1}`,
      value: answer.value ?? answer.answer ?? answer.response,
    }
  })
}

export function applicantAnswerParts(
  value: unknown,
): { text: string; url: string | null }[] {
  if (Array.isArray(value)) return value.flatMap(applicantAnswerParts)
  if (isRecord(value))
    return applicantAnswerParts(
      value.url ??
        value.link ??
        value.label ??
        value.value ??
        JSON.stringify(value),
    )
  const text =
    value === null || value === undefined || value === ''
      ? 'No response'
      : typeof value === 'boolean'
        ? value
          ? 'Yes'
          : 'No'
        : String(value)
  return [{ text, url: safeApplicantUrl(text) }]
}
