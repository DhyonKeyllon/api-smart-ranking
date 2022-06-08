import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { PlayersModule } from './../players/players.module';
import { CategorySchema } from './interfaces/category.schema';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    PlayersModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
