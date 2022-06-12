import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';

import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async getAll(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getById(_id: string): Promise<Player> {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException(`O id ${_id} é inválido.`);
    }

    const playerFound = await this.playerModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Jogador com o id ${_id} não encontrado.`);
    }

    return await this.playerModel.findOne({ _id }).exec();
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (playerFound) {
      throw new BadRequestException(`Jogador com o e-mail ${email} já existe.`);
    }

    const playerCreated = new this.playerModel(createPlayerDto);
    return await playerCreated.save();
  }

  async update(_id: string, createPlayerDto: UpdatePlayerDto): Promise<void> {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException(`O id ${_id} é inválido.`);
    }

    const playerFound = await this.playerModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Jogador com o id ${_id} não encontrado.`);
    }

    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: createPlayerDto })
      .exec();
  }

  async delete(_id: string): Promise<void> {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException(`O id ${_id} é inválido.`);
    }

    const playerFound = await this.playerModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Jogador com o id ${_id} não encontrado.`);
    }

    await this.playerModel.deleteOne({ _id }).exec();
  }
}
