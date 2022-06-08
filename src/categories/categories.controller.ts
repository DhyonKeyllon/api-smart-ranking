import { CategoriesService } from './categories.service';
import { Categorie } from './interfaces/categorie.interface';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateCategorieDto } from './dtos/create-categorie.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategories(
    @Body() createCategoriesDto: CreateCategorieDto,
  ): Promise<Categorie> {
    return await this.categoriesService.createCategory(createCategoriesDto);
  }
}
