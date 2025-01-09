import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/multer/multer.config';

@Module({
  imports: [MulterModule.register(multerConfig('categories'))],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
