import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategorieDto } from './dtos/create-categorie.dto';

import { Categorie } from './interfaces/categorie.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categorie')
    private readonly categorieModule: Model<Categorie>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategorieDto,
  ): Promise<Categorie> {
    const { categorie } = createCategoryDto;

    const categorieFound = await this.categorieModule
      .findOne({ categorie })
      .exec();

    if (categorieFound) {
      throw new Error('Categorie already exists');
    }

    const categorieCreated = new this.categorieModule(createCategoryDto);

    return await categorieCreated.save();
  }
}
