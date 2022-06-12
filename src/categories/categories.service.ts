import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { PlayersService } from './../players/players.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModule: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const categoryFound = await this.categoryModule
      .findOne({ category })
      .exec();

    if (categoryFound) {
      throw new BadRequestException('Categoroa já cadastrada.');
    }

    const categoryCreated = new this.categoryModule(createCategoryDto);

    return await categoryCreated.save();
  }

  async getCategories(): Promise<Category[]> {
    return await this.categoryModule.find().populate('players').exec();
  }

  async getCategory(category: string): Promise<Category> {
    const categoryFound = await this.categoryModule
      .findOne({ category })
      .exec();

    if (!categoryFound) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    return categoryFound;
  }

  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const categoryFound = await this.categoryModule
      .findOneAndUpdate({ category }, updateCategoryDto, { new: true })
      .exec();

    if (!categoryFound) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return categoryFound;
  }

  async setPlayerCategory(params: string[]): Promise<Category> {
    const category = params['category'];
    const idPlayer = params['idPlayer'];

    const categoryFound = await this.categoryModule
      .findOne({ category })
      .exec();

    if (!categoryFound) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const playerAlreadyExistsInCategory = await this.categoryModule
      .find({ category })
      .where('players')
      .in([idPlayer])
      .exec();

    if (playerAlreadyExistsInCategory.length > 0) {
      throw new BadRequestException(
        'Jogador já está cadastrado nesta categoria.',
      );
    }

    await this.playersService.getById(idPlayer);

    categoryFound.players.push(idPlayer);

    await this.categoryModule
      .findOneAndUpdate({ category }, { $set: categoryFound })
      .exec();

    return categoryFound;
  }

  async getPlayerCategory(_id: any): Promise<Category> {
    const players = await this.playersService.getAll();

    const playersFilter = players.filter((player) => player._id == _id);

    if (playersFilter.length == 0) {
      throw new BadRequestException(`The id ${_id} don't is a player`);
    }

    return await this.categoryModule
      .findOne()
      .where('players')
      .in([_id])
      .exec();
  }
}
