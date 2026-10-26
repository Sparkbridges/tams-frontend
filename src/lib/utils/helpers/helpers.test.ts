import { describe, expect, it } from 'vitest'
import { paramsSerializer } from './helpers'

describe('paramsSerializer', () => {
  it('omits null and undefined values', () => {
    expect(
      paramsSerializer({
        missing: undefined,
        empty: null,
        keepEmptyString: '',
        keepZero: 0,
        keepFalse: false,
        query: 'annual leave',
      }),
    ).toBe('keepEmptyString=&keepZero=0&keepFalse=false&query=annual%20leave')
  })

  it('omits null and undefined array items and empty arrays', () => {
    expect(
      paramsSerializer({
        ids: [1, undefined, null, 2],
        empty: [],
      }),
    ).toBe('ids[]=1&ids[]=2')
  })
})
