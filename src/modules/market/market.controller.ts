import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { MarketService } from './market.service';
import { AdminGuard } from 'src/auth/jwt/admin.guard';
import { SellerGuard } from 'src/auth/jwt/seller.guard';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  @UseGuards(JwtAuthGuard, SellerGuard)
  create(@Body() createMarketDto: CreateMarketDto, @Request() req) {
    createMarketDto.user_id = req.user.id as string;
    return this.marketService.create(createMarketDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll(@Query() query: { page: string; perPage: string }) {
    return this.marketService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.update(id, updateMarketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketService.remove(id);
  }
}
