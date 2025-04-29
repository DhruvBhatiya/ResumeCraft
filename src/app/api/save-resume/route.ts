import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const resumeData = await req.json();
    const filePath = path.join(process.cwd(), 'public', 'resume.json');

    let existingData: any[] = [];

    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(fileContents || '[]');
    } catch (readError: any) {
      // If file doesn't exist or is empty/malformed, initialize as empty array
      console.warn('resume.json missing or unreadable. Initializing with empty array.');
      existingData = [];
    }

    // Add timestamp or name-based key if needed
    existingData.push(resumeData);

    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'Resume saved successfully.' });
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json({ success: false, message: 'Failed to save resume.' }, { status: 500 });
  }
}
