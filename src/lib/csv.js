// Turns rows into CSV text (comma-separated values) that Excel and Google Sheets can open.

// The columns of the exported file: header text, the key in each order, and an optional format.
export const ORDER_COLUMNS = [
  { key: 'id', label: 'Order ID' },
  { key: 'date', label: 'Date' },
  { key: 'product', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'region', label: 'Region' },
  { key: 'channel', label: 'Channel' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'amount', label: 'Amount', format: (value) => value.toFixed(2) },
  { key: 'status', label: 'Status' },
]

// One cell. It needs quotes when the text has a comma, a quote or a line break,
// and a quote inside is written twice (""). This is the CSV standard (RFC 4180).
export function escapeCell(value) {
  if (value === null || value === undefined) return ''
  let text = String(value)
  // Spreadsheets run text that starts with = + - @ as a formula ("CSV injection").
  // A leading ' keeps it as plain text. Real numbers like -5.00 are left alone.
  if (/^[=+\-@]/.test(text) && Number.isNaN(Number(text))) text = `'${text}`
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

// A header row, then one row per item. CSV files traditionally use \r\n between rows.
export function toCsv(rows, columns) {
  const cell = (row, column) => escapeCell(column.format ? column.format(row[column.key]) : row[column.key])
  const header = columns.map((column) => escapeCell(column.label)).join(',')
  const lines = rows.map((row) => columns.map((column) => cell(row, column)).join(','))
  return [header, ...lines].join('\r\n')
}

// 'pulse-orders-2026-10-02-to-2026-10-31.csv'
export function csvFileName(range) {
  return `pulse-orders-${range.start}-to-${range.end}.csv`
}

// Starts a download in the browser without a server: the text becomes a Blob
// (a file in memory) and a hidden link with a "download" attribute is clicked.
export function downloadCsv(text, fileName) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  // Free the memory a moment later: some browsers still need the URL while the download starts.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
