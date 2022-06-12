import { PartialType } from '@nestjs/mapped-types';

import { IsOptional } from 'class-validator';

import { ChallengeStatus } from './../interfaces/challenge-status.enum';
import { CreateChallengeDto } from './create-challenge.dto';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {
  @IsOptional()
  dateTimeChallenge?: Date;

  @IsOptional()
  status: ChallengeStatus;
}
