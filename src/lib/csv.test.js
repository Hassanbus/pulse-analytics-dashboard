import { afterEach, describe, expect, it, vi } from 'vitest'
import { ORDER_COLUMNS, csvFileName, downloadCsv, escapeCell, toCsv } from './csv.js'
import { sampleOrders } from '../test/fixtures.js'

describe('escapeCell', () => {
  it('leaves simple values alone and turns empty values into nothing', () => {
    expect(escapeCell('Website')).toBe('Website')
    expect(escapeCell(42.5)).toBe('42.5')
    expect(escapeCell(null)).toBe('')
    expect(escapeCell(undefined)).toBe('')
  })

  it('quotes commas, quotes and line breaks, and doubles inner quotes', () => {
    expect(escapeCell('Hub, USB-C')).toBe('"Hub, USB-C"')
    expect(escapeCell('27" Monitor')).toBe('"27"" Monitor"')
    expect(escapeCell('two\nlines')).toBe('"two\nlines"')
  })

  it('stops spreadsheet formulas but keeps real negative numbers', () => {
    expect(escapeCell('=SUM(A1:A9)')).toBe("'=SUM(A1:A9)")
    expect(escapeCell('@cmd')).toBe("'@cmd")
    expect(escapeCell('-5.00')).toBe('-5.00')
  })
})

describe('toCsv', () => {
  it('writes a header row and one row per order, in column order', () => {
    const csv = toCsv(sampleOrders.slice(0, 2), ORDER_COLUMNS)
    expect(csv.split('\r\n')).toEqual([
      'Order ID,Date,Product,Category,Region,Channel,Quantity,Amount,Status',
      'ORD-1,2026-10-01,Alpha,Audio,Europe,Website,1,100.00,completed',
      'ORD-2,2026-10-01,Beta,Wearables,Europe,Mobile app,2,50.00,completed',
    ])
  })

  it('writes only the header when there are no rows', () => {
    expect(toCsv([], [{ key: 'id', label: 'Order ID' }])).toBe('Order ID')
  })
})

describe('csvFileName', () => {
  it('puts the date range in the file name', () => {
    expect(csvFileName({ start: '2026-10-02', end: '2026-10-31' })).toBe('pulse-orders-2026-10-02-to-2026-10-31.csv')
  })
})

describe('downloadCsv', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('clicks a hidden download link with the CSV file, then frees the memory', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout'] })
    const link = { click: vi.fn(), remove: vi.fn() }
    const append = vi.fn()
    // Tests run in Node, which has no page. A small fake "document" records what the code does.
    vi.stubGlobal('document', { createElement: vi.fn(() => link), body: { append } })
    const createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    const revokeUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    downloadCsv('a,b\r\n1,2', 'orders.csv')

    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(link).toMatchObject({ href: 'blob:test', download: 'orders.csv' })
    expect(append).toHaveBeenCalledWith(link)
    expect(link.click).toHaveBeenCalledOnce()
    expect(link.remove).toHaveBeenCalledOnce()

    const blob = createUrl.mock.calls[0][0]
    expect(blob.type).toBe('text/csv;charset=utf-8')
    expect(await blob.text()).toBe('a,b\r\n1,2')

    expect(revokeUrl).not.toHaveBeenCalled()
    vi.runAllTimers()
    expect(revokeUrl).toHaveBeenCalledWith('blob:test')
  })
})
