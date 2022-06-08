import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';

import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModule: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const categoryFound = await this.categoryModule
      .findOne({ category })
      .exec();

    if (categoryFound) {
      throw new Error('Category already exists');
    }

    const categoryCreated = new this.categoryModule(createCategoryDto);

    return await categoryCreated.save();
  }

  async getCategories(): Promise<Category[]> {
    return await this.categoryModule.find().exec();
  }

  async getCategory(category: string): Promise<Category> {
    const categoryFound = await this.categoryModule
      .findOne({ category })
      .exec();

    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }
    return categoryFound;
  }
}
