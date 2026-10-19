import 'server-only'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getActiveSessionUser() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
    },
  })

  if (!user || !user.isActive) {
    return null
  }

  return user
}
