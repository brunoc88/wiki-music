import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma' // ajustá el path si hace falta

export const loadUsers = async () => {
  const passwordHash = await bcrypt.hash('sekrets', 10)
  const answerHash = await bcrypt.hash('resident evil 2', 10)

  await prisma.$transaction([
    // ADMINS
    prisma.user.createMany({
      data: [
        {
          email: 'admin1@test.com',
          username: 'admin1',
          password: passwordHash,
          rol: 'admin',
          securityQuestion: 'videojuego fav?',
          securityAnswer: answerHash,
          state: true,
          pic:""
        },
        {
          email: 'admin2@test.com',
          username: 'admin2',
          password: passwordHash,
          rol: 'admin',
          securityQuestion: 'videojuego fav?',
          securityAnswer: answerHash,
          state: true,
          pic:""
        },
        {
          email: 'admin3@test.com',
          username: 'admin3',
          password: passwordHash,
          rol: 'admin',
          securityQuestion: 'videojuego fav?',
          securityAnswer: answerHash,
          state: false,
          pic:""
        }
      ]
    }),

    // USERS COMUNES
    prisma.user.createMany({
      data: [
        {
          email: 'user1@test.com',
          username: 'user1',
          password: passwordHash,
          rol: 'user',
          securityQuestion: 'videojuego fav?',
          securityAnswer: answerHash,
          state: true,
          pic:""
        },
        {
          email: 'user2@test.com',
          username: 'user2',
          password: passwordHash,
          rol: 'user',
          securityQuestion: 'videojuego fav?',
          securityAnswer: answerHash,
          state: true,
          pic:""
        },
        {
          email: 'user3@test.com',
          username: 'user3',
          password: passwordHash,
          rol: 'user',
          securityQuestion: 'videojuego fav?',
          securityAnswer: answerHash,
          state: false,
          pic:""
        }
      ]
    })
  ])
}

export const getUsers = async () => {
    return await prisma.user.findMany()
}
