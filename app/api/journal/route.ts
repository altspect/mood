import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { analyze } from '@/utils/ai';

export const POST = async () => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.create({
    data: {
        userId: user.id,
        content: 'Write about your day!',
      },
  });

  const analysis = await analyze(entry.content);
  console.log(entry, analysis);
  await prisma.analysis.create({
    data: {
      entryId: entry.id,
      ...analysis
    }
  });

  revalidatePath('/journal');

  return NextResponse.json({ data: entry });
}
