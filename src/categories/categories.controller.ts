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

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

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
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('category') category: string,
  ): Promise<Category> {
    return await this.categoriesService.updateCategory(
      category,
      updateCategoryDto,
    );
  }

  @Post('/:category/players/:idPlayer')
  async setPlayerCategory(@Param() params: string[]): Promise<void> {
    await this.categoriesService.setPlayerCategory(params);
  }
}
