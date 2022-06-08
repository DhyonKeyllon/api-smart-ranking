import { ParamsValidationPipe } from '../common/pipes/params-validation.pipe';
import { Player } from './interfaces/player.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getAll(): Promise<Player[]> {
    return await this.playersService.getAll();
  }

  @Get('/:_id')
  async getById(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.getById(_id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playersService.create(createPlayerDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('_id', ParamsValidationPipe) _id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    await this.playersService.update(_id, updatePlayerDto);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ParamsValidationPipe) _id: string,
  ): Promise<void> {
    await this.playersService.delete(_id);
  }
}
