import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateHourReply: Date;
  dateHourRequest: Date;
  requester: Player;
  category: string;
  players: Player[];
  match: Match;
}

export interface Match {
  category: string;
  players: Player[];
  def: Player;
  result: Result[];
}

export interface Result {
  set: string;
}
