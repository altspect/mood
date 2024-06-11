import { currentUser } from '@clerk/nextjs';
import { prisma } from '@/utils/db';
import { redirect } from 'next/navigation';

const createNewUser = async () => {
  const user = await currentUser();

  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id
    }
  });

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user?.emailAddresses[0].emailAddress
      }
    })
  }
  console.log('redirecting');
  redirect('/journal')
};

const NewUser = async () => {
  await createNewUser();
  return <div>Hi</div>
};

export default NewUser;
