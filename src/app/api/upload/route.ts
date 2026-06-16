import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Required for pdf-parse and mammoth to use node APIs

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate size (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    let content = '';
    let pageCount = undefined;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (extension === 'txt') {
      content = await file.text();
    } 
    else if (extension === 'pdf') {
      // Dynamic import to avoid edge runtime issues
      const pdfParseModule = await import('pdf-parse');
      // @ts-ignore
      const pdfParse = pdfParseModule.default || pdfParseModule;
      const data = await pdfParse(buffer);
      content = data.text;
      pageCount = data.numpages;
    } 
    else if (extension === 'docx') {
      // Dynamic import
      const mammothModule = await import('mammoth');
      // @ts-ignore
      const mammoth = mammothModule.default || mammothModule;
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } 
    else {
      return NextResponse.json({ error: 'Unsupported file type. Use .txt, .pdf, or .docx' }, { status: 400 });
    }

    return NextResponse.json({
      fileName,
      content: content.trim(),
      pageCount,
      fileType: extension as 'txt' | 'pdf' | 'docx'
    });

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: error.message || 'Error processing file' }, { status: 500 });
  }
}
