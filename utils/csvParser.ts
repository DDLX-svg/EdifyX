
export function parseCSV<T>(csvText: string): T[] {
  if (!csvText || csvText.trim() === '') {
    return [];
  }
  
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) {
    return [];
  }

  // Helper to parse a CSV row, handling quotes
  const parseRow = (row: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"' && (i === 0 || row[i-1] !== '\\')) { // Handle escaped quotes if any, basic version
            const nextChar = row[i+1];
            if(inQuotes && nextChar === '"') { // double quote inside quoted field
                current += '"';
                i++; // skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]).map(h => h.replace(/"/g, '').trim());
  const data: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (values.length !== headers.length) {
        console.warn(`Skipping malformed CSV row ${i + 1}:`, lines[i]);
        continue;
    }
    const obj: { [key: string]: any } = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      let value = values[j] || '';
      // Remove leading/trailing quotes only if they exist
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      // Replace double double-quotes with a single double-quote
      value = value.replace(/""/g, '"');
      obj[header] = value;
    }
    data.push(obj as T);
  }

  return data;
}
