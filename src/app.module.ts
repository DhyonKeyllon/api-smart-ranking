import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dhyon:1234@cluster0.ksctfjw.mongodb.net/smartranking?retryWrites=true&w=majority',
    ),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
