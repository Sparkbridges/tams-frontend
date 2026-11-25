import { describe, expect, it } from 'vitest'
import { formatCurrency, paramsSerializer } from './helpers'

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

  describe('formatCurrency', () => {
    it('formats comma-separated and ungrouped amounts', () => {
      expect(formatCurrency('250,000')).toBe('₦250,000.00')
      expect(formatCurrency(' 250000.50 ', 'USD')).toBe('$250,000.50')
      expect(formatCurrency('0')).toBe('₦0.00')
    })

    it.each(['', '1,23', '50,000 - 70,000', 'abc'])(
      'rejects invalid amount %j instead of displaying NaN',
      (amount) => {
        expect(() => formatCurrency(amount)).toThrow('Invalid currency amount')
      },
    )
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
