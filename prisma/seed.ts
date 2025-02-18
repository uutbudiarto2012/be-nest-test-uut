import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  try {
    const admin = await prisma.user.create({
      data: {
        full_name: 'Admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('888999', 10),
        role: 'admin',
      },
    });

    const seller = await prisma.user.create({
      data: {
        full_name: 'Seller',
        email: 'seller@gmail.com',
        password: bcrypt.hashSync('888999', 10),
        role: 'seller',
      },
    });

    const category = await prisma.category.create({
      data: {
        name: 'Sample category',
        description: 'Sample description good category',
      },
    });

    const market = await prisma.market.create({
      data: {
        name: 'Sample Market Name',
        user_id: seller.id,
        description: 'Sample Market Description',
      },
    });

    const products = await prisma.product.createMany({
      data: [
        {
          name: 'Sample Product Name',
          category_id: category.id,
          market_id: market.id,
          description: 'Sample Description Name',
          price: 10000,
          stock: 10,
        },
        {
          name: 'Sample Product Name 2',
          category_id: category.id,
          market_id: market.id,
          description: 'Sample Description Name 2',
          price: 1000,
          stock: 10,
        },
      ],
    });

    console.log({
      seller,
      market,
      admin,
      products,
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
