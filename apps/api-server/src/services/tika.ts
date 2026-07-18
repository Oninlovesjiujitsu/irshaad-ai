import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);

const rawPdfParse = require('pdf-parse');
const pdfParse = rawPdfParse.default || rawPdfParse;


export async function extractText(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const extension = filename.split('.').pop()?.toLowerCase();

  try {
    if (extension === 'pdf') {
      const data = await pdfParse(buffer);
      return data.text.trim();
    }

    if (extension === 'docx') {
      const data = await mammoth.extractRawText({ buffer });
      return data.value.trim();
    }

    if (extension === 'txt') {
      return buffer.toString('utf-8').trim();
    }

    throw new Error(`Unsupported file type: .${extension}`);
  } catch (error: any) {
    throw new Error(`Extraction failed for "${filename}": ${error.message}`);
  }
}

