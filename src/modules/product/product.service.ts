import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';
import { createPaginator } from 'prisma-pagination';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly db: DatabaseService) {}
  create(createProductDto: CreateProductDto) {
    return this.db.product.create({
      data: createProductDto,
    });
  }

  findAll(query: { page: string; perPage: string; category_id: string }) {
    const { page, perPage, category_id } = query;
    const paginate = createPaginator({ page, perPage });
    const whereFilter: Prisma.ProductFindManyArgs['where'] = category_id
      ? { category_id: category_id }
      : {};
    return paginate<Product, Prisma.ProductFindManyArgs>(this.db.product, {
      where: whereFilter,
      select: {
        id: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        name: true,
        description: true,
        price: true,
        stock: true,
        created_at: true,
        market: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const response = await this.db.product.findUnique({
      where: { id },
      select: {
        id: true,
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        name: true,
        description: true,
        price: true,
        stock: true,
        created_at: true,
        market: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
    if (!response) {
      throw new NotFoundException(`ID: ${id} not found`);
    }
    return response;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.db.product.update({
      where: { id },
      data: updateProductDto,
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.product.delete({
      where: { id },
      select: {
        id: true,
      },
    });
  }
}
