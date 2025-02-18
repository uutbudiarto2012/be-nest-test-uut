import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMarketDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
