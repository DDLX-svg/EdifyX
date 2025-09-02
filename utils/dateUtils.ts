/**
 * Parses a Vietnamese date string and returns a formatted month and year string.
 * @param dateStr The date string in "DD/MM/YYYY HH:mm:ss" format.
 * @returns A string like "Tháng MM, YYYY" or an empty string if the input is invalid.
 */
export const getMonthYearFromVNDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  // Format: "DD/MM/YYYY HH:mm:ss"
  const parts = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!parts) return '';

  const month = parts[2];
  const year = parts[3];
  
  return `Tháng ${month}, ${year}`;
};

/**
 * Formats a Vietnamese date string to "DD/MM/YYYY".
 * @param dateStr The date string in "DD/MM/YYYY HH:mm:ss" format.
 * @returns A string like "DD/MM/YYYY" or an empty string if the input is invalid.
 */
export const formatVNDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split(' ');
  return parts[0] || '';
};
