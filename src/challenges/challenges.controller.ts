import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Logger,
  Query,
  Put,
} from '@nestjs/common';

import { ParamsValidationPipe } from 'src/common/pipes/params-validation.pipe';

import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { SetMatchChallengeDto } from './dtos/set-challenge-match.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ParamsValidationPipe)
  async create(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    this.logger.log(
      `createChallengeDto: ${JSON.stringify(createChallengeDto)}`,
    );
    return await this.challengesService.create(createChallengeDto);
  }

  @Get()
  async findAll(@Query(':_id') _id: string): Promise<Challenge | Challenge[]> {
    return _id
      ? await this.challengesService.findOne(_id)
      : await this.challengesService.findAll();
  }

  @Put(':_id')
  async update(
    @Param('_id') _id: string,
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    await this.challengesService.update(_id, updateChallengeDto);
  }

  @Post('/:challenge/match/')
  async setMatchChallenge(
    @Body(ValidationPipe) setMatchChallengeDto: SetMatchChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.setMatchChallenge(
      _id,
      setMatchChallengeDto,
    );
  }

  @Delete(':_id')
  deleteChallenge(@Param('_id') _id: string) {
    return this.challengesService.deleteChallenge(_id);
  }
}
