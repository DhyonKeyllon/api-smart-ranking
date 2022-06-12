import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CategoriesService } from './../categories/categories.service';
import { PlayersService } from './../players/players.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { SetMatchChallengeDto } from './dtos/set-challenge-match.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge, Match } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge')
    private readonly challengeModule: Model<Challenge>,
    @InjectModel('Match')
    private readonly matchModule: Model<Match>,
    private readonly playerService: PlayersService,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(createChallengeDto: CreateChallengeDto) {
    const playersList = await this.playerService.getAll();

    createChallengeDto.players.map((playerDto) => {
      const playerFilter = playersList.filter(
        (player) => player._id == playerDto._id,
      );

      if (playerFilter.length == 0) {
        throw new BadRequestException(
          `Player with id ${playerDto._id} does not exist`,
        );
      }
    });

    const isMatchParticipant = createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.requester,
    );

    if (isMatchParticipant.length == 0) {
      throw new BadRequestException(
        `The applicant is not part of the challenge.`,
      );
    }

    const playerCategory = await this.categoryService.getPlayerCategory(
      createChallengeDto.requester,
    );

    if (!playerCategory) {
      throw new BadRequestException(
        `The requester must be registered in a category.`,
      );
    }

    const challengeCreated = new this.challengeModule(createChallengeDto);
    challengeCreated.category = playerCategory.category;
    challengeCreated.dateHourRequest = new Date();
    challengeCreated.status = ChallengeStatus.PENDING;
    return await challengeCreated.save();
  }

  async findAll(): Promise<Challenge[]> {
    return await this.challengeModule
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async findOne(_id: string): Promise<Challenge> {
    return await this.challengeModule.findOne({ _id }).exec();
  }

  async findPlayerChallenges(_id: string): Promise<Challenge[]> {
    const players = await this.playerService.getAll();

    const playersFilter = players.filter((player) => player._id == _id);

    if (playersFilter.length == 0) {
      throw new BadRequestException(`The id ${_id} don't is a player`);
    }

    return await this.challengeModule
      .find()
      .where('players')
      .in([_id])
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async update(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const challengeFound = await this.challengeModule.findById(_id).exec();

    if (!challengeFound) {
      throw new NotFoundException(`Challenge with id ${_id} does not exist`);
    }

    if (updateChallengeDto.status) {
      challengeFound.dateHourReply = new Date();
    }

    challengeFound.status = updateChallengeDto.status;
    challengeFound.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

    await this.challengeModule
      .findOneAndUpdate({ _id }, { $set: challengeFound })
      .exec();
  }

  async setMatchChallenge(
    _id: string,
    setMatchChallengeDto: SetMatchChallengeDto,
  ): Promise<void> {
    const challengeFound = await this.challengeModule.findById(_id).exec();

    if (!challengeFound) {
      throw new NotFoundException(`Challenge with id ${_id} does not exist`);
    }

    const playerFilter = challengeFound.players.filter(
      (player) => player._id == setMatchChallengeDto.def._id,
    );

    if (playerFilter.length == 0) {
      throw new BadRequestException(`The winner is not part of the challenge`);
    }

    const createdMatch = new this.matchModule(setMatchChallengeDto);

    createdMatch.category = challengeFound.category;

    createdMatch.players = challengeFound.players;

    const result = await createdMatch.save();

    challengeFound.status = ChallengeStatus.ACCOMPLISHED;

    challengeFound.match = result;

    try {
      await this.challengeModule
        .findOneAndUpdate({ _id }, { $set: challengeFound })
        .exec();
    } catch (error) {
      await this.matchModule.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallenge(_id: string): Promise<void> {
    const challengeFound = await this.challengeModule.findById(_id).exec();

    if (!challengeFound) {
      throw new NotFoundException(`Challenge with id ${_id} does not exist`);
    }

    challengeFound.status = ChallengeStatus.CANCELED;

    await this.challengeModule
      .findOneAndUpdate({ _id }, { $set: challengeFound })
      .exec();
  }
}
