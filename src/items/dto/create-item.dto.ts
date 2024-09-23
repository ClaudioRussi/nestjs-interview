import {IsBoolean, IsOptional, IsString} from 'class-validator';

export class CreateItemDto {
  
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  completed: boolean;
}
