import { describe, expect, it } from 'vitest'
import {
  applicantAnswerParts,
  applicantAnswers,
  applicantDocumentPath,
  safeApplicantUrl,
} from './applicantAnswers'

describe('applicant answer display', () => {
  it('handles legacy JSON strings and structured answers without dropping false or zero', () => {
    const answers = applicantAnswers(
      '[{"question":"Available?","value":false},{"label":"Experience","answer":0},"Portfolio"]',
    )
    expect(answers).toEqual([
      { question: 'Available?', value: false },
      { question: 'Experience', value: 0 },
      { question: 'Answer 3', value: 'Portfolio' },
    ])
    expect(applicantAnswerParts(answers[0].value)[0].text).toBe('No')
    expect(applicantAnswerParts(answers[1].value)[0].text).toBe('0')
  })
  it('keeps only HTTP(S) links clickable and handles multiple uploaded files', () => {
    expect(
      applicantAnswerParts([
        { url: 'https://example.com/cv.pdf' },
        { link: 'https://example.com/portfolio' },
      ]),
    ).toHaveLength(2)
    expect(safeApplicantUrl('javascript:alert(1)')).toBeNull()
    expect(safeApplicantUrl('data:text/html,test')).toBeNull()
    expect(safeApplicantUrl('not a link')).toBeNull()
  })
  it('surfaces malformed answers instead of displaying an empty success state', () => {
    expect(() => applicantAnswers('{invalid')).toThrow()
    expect(() => applicantAnswers({ question: 'Unsupported' })).toThrow(
      /Unsupported/,
    )
  })
  it('resolves private Google storage URLs without fetching external CV URLs', () => {
    expect(
      applicantDocumentPath(
        'https://storage.googleapis.com/download/storage/v1/b/bucket/o/7%2Frecruitment%2Fcv.pdf?alt=media',
      ),
    ).toBe('7/recruitment/cv.pdf')
    expect(
      applicantDocumentPath('https://storage.googleapis.com/bucket/7/cv.pdf'),
    ).toBe('7/cv.pdf')
    expect(
      applicantDocumentPath('https://bucket.storage.googleapis.com/7/cv.pdf'),
    ).toBe('7/cv.pdf')
    expect(applicantDocumentPath('https://example.com/cv.pdf')).toBeNull()
  })
})
