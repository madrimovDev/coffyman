import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({ required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiProperty({ required: false })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  phone?: string;
}
