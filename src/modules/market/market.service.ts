import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { DatabaseService } from 'src/database/database.service';
import { createPaginator } from 'prisma-pagination';
import { Market, Prisma } from '@prisma/client';

@Injectable()
export class MarketService {
  constructor(private readonly db: DatabaseService) {}
  create(createMarketDto: CreateMarketDto) {
    return this.db.market.create({ data: createMarketDto });
  }

  findAll(query: { page: string; perPage: string }) {
    const { page, perPage } = query;
    const paginate = createPaginator({ page, perPage });
    return paginate<Market, Prisma.MarketFindManyArgs>(this.db.market, {
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const response = await this.db.market.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });
    if (!response) {
      throw new NotFoundException(`ID: ${id} not found`);
    }
    return response;
  }

  async update(id: string, updateMarketDto: UpdateMarketDto) {
    await this.findOne(id);
    return this.db.market.update({
      where: { id },
      data: updateMarketDto,
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
    return this.db.market.delete({
      where: { id },
      select: {
        id: true,
      },
    });
  }
}
