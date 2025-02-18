import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.createMany({
      data: [
        {
          full_name: 'Admin',
          email: 'admin@gmail.com',
          password: bcrypt.hashSync('888999', 10),
          role: 'admin',
        },
        {
          full_name: 'Seller',
          email: 'seller@gmail.com',
          password: bcrypt.hashSync('888999', 10),
          role: 'seller',
        },
        {
          full_name: 'Customer',
          email: 'customer@gmail.com',
          password: bcrypt.hashSync('888999', 10),
          role: 'customer',
        },
      ],
    });

    const category = await prisma.category.createMany({
      data: [
        {
          name: 'Pakaian',
          description: 'Pakaian Bagus Semua',
        },
        {
          name: 'Elektronik',
          description: 'Elektronik Bagus Semua',
        },
      ],
    });

    console.log({
      users,
      category,
    });
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
