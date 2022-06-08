import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/category.interface';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategories(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  async getCategories(): Promise<Category[]> {
    return await this.categoriesService.getCategories();
  }

  @Get('/:category')
  async getCategory(@Param('category') category: string): Promise<Category> {
    return await this.categoriesService.getCategory(category);
  }

  @Put('/:category')
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('category') category: string,
  ): Promise<Category> {
    return await this.categoriesService.updateCategory(
      category,
      updateCategoryDto,
    );
  }
}
