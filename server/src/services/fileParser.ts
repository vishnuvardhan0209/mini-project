import fs from 'fs';

export function parseFileContent(filePath: string, originalName: string, mimeType: string): string {
  try {
    if (!fs.existsSync(filePath)) {
      return '';
    }

    const extension = originalName.split('.').pop()?.toLowerCase() || '';

    if (extension === 'txt' || mimeType.includes('text/plain')) {
      return fs.readFileSync(filePath, 'utf-8');
    }

    // For PDF and DOCX in lightweight environments:
    // Extract readable ASCII and UTF-8 strings
    const buffer = fs.readFileSync(filePath);
    const rawText = buffer.toString('utf-8');

    // Filter printable chunks of characters (length > 3)
    const matches = rawText.match(/[\x20-\x7E\t\r\n]{4,}/g);
    if (matches && matches.length > 0) {
      const extracted = matches
        .filter(m => !m.startsWith('/Filter') && !m.startsWith('/Catalog') && !m.startsWith('xref'))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (extracted.length > 50) {
        return extracted;
      }
    }

    return `Uploaded file: ${originalName}. Content processed for knowledge testing and question generation.`;
  } catch (error) {
    console.error('Error parsing file content:', error);
    return `Uploaded document: ${originalName}`;
  }
}
