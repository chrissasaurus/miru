import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TmdbModule } from './tmdb/tmdb.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TmdbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
