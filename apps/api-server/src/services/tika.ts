const TIKA_URL = process.env.TIKA_URL ?? 'http://localhost:9998';

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function extractText(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(`${TIKA_URL}/tika`, {
      method: 'PUT',
      headers: {
        'Content-Disposition': `attachment; filename="${sanitizeFilename(filename)}"`,
        Accept: 'text/plain',
      },
      body: buffer as any,
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(
        `Tika extraction failed for "${filename}": ${res.status} ${await res.text()}`
      );
    }
    return (await res.text()).trim();
  } finally {
    clearTimeout(timeout);
  }
}
