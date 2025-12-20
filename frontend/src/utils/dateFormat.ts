/**
 * Безопасно форматирует дату в локальную строку
 * @param dateString - Строка даты (ISO 8601 или другой формат)
 * @returns Отформатированная дата или fallback
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) {
    return 'Дата неизвестна'
  }

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}`)

      return 'Дата неизвестна'
    }

    return date.toLocaleDateString()
  } catch (error) {
    console.error('Error formatting date:', error)

    return 'Дата неизвестна'
  }
}
