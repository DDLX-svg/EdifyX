
export function parseCSV<T>(csvText: string): T[] {
  if (!csvText || csvText.trim() === '') {
    return [];
  }

  // Split into lines, filtering out empty ones.
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) {
    return [];
  }

  // A robust function to parse a single CSV row, correctly handling quoted fields and escaped quotes.
  const parseRow = (row: string): string[] => {
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      const nextChar = row[i + 1];

      if (char === '"') {
        if (inQuotes) {
          if (nextChar === '"') {
            // This is an escaped quote ("") inside a quoted field.
            currentField += '"';
            i++; // Skip the second double-quote of the pair.
          } else {
            // This is the closing quote of a field.
            inQuotes = false;
          }
        } else {
          // This is the opening quote of a field.
          inQuotes = true;
        }
      } else if (char === ',' && !inQuotes) {
        // A comma outside of quotes is a field delimiter.
        fields.push(currentField);
        currentField = '';
      } else {
        // A regular character.
        currentField += char;
      }
    }
    fields.push(currentField); // Add the last field
    return fields;
  };

  // The first line contains the headers. Parse them just like a data row.
  const headers = parseRow(lines[0]).map(header => {
    // Google Sheets often adds quotes to all headers; remove them.
    return header.trim().replace(/^"|"$/g, '');
  });

  const data: T[] = [];
  // Start from the second line for the actual data.
  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);

    // Handle potential discrepancies between header count and value count.
    if (values.length !== headers.length) {
      console.warn(`CSV Parse Warning: Row ${i + 1} has ${values.length} fields, but header has ${headers.length}.`, { row: lines[i], parsed: values });
    }
    
    const obj: { [key: string]: any } = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      // Assign value, defaulting to empty string if a column is missing in a row.
      const value = values[j] || '';
      obj[header] = value;
    }
    data.push(obj as T);
  }

  return data;
}
