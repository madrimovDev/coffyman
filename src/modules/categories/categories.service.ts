import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image?: Express.Multer.File,
  ) {
    try {
      const index = image ? image.path.indexOf('uploads') : -1;
      const imagePath = image ? image.path.slice(index) : undefined;

      const existingCategory = await this.prisma.category.findUnique({
        where: { name: createCategoryDto.name },
      });

      if (existingCategory) {
        if (imagePath) {
          await this.deleteImage(imagePath);
        }
        throw new BadRequestException(
          `Category with name "${createCategoryDto.name}" already exists`,
        );
      }

      const category = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          description: createCategoryDto.description,
          image: imagePath,
        },
      });

      return category;
    } catch (error) {
      if (image?.path) {
        await this.deleteImage(image.path).catch(() => {});
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Category with this name already exists',
          );
        }
      }

      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany();

      if (!categories.length) {
        throw new NotFoundException('No categories found');
      }

      return categories;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid category ID format');
      }
      throw new InternalServerErrorException('Failed to fetch category');
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    image?: Express.Multer.File,
  ) {
    try {
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        if (image?.path) {
          await this.deleteImage(image.path);
        }
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      const index = image ? image.path.indexOf('uploads') : -1;
      const newImagePath = image ? image.path.slice(index) : undefined;

      if (newImagePath && existingCategory.image) {
        await this.deleteImage(existingCategory.image).catch(() => {});
      }

      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
          description: updateCategoryDto.description,
          image: newImagePath || existingCategory.image,
        },
      });

      return updatedCategory;
    } catch (error) {
      if (image?.path) {
        await this.deleteImage(image.path).catch(() => {});
      }

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid data provided for update');
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Category with this name already exists',
          );
        }
      }
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      await this.prisma.category.delete({
        where: { id },
      });

      if (category.image) {
        await this.deleteImage(category.image).catch(() => {});
      }

      return {
        message: `Category with ID ${id} has been successfully deleted`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid category ID format');
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Cannot delete category due to existing references',
          );
        }
      }
      throw new InternalServerErrorException('Failed to delete category');
    }
  }

  private async deleteImage(imagePath: string): Promise<void> {
    try {
      const fullPath = path.join(process.cwd(), imagePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  }
}
