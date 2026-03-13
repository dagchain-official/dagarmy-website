import { join } from 'path';
import { readFileSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'pdfs', 'DAG-Army-Reward-System.pdf');
    const fileBuffer = readFileSync(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="DAG-Army-Reward-System.pdf"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response('File not found', { status: 404 });
  }
}
