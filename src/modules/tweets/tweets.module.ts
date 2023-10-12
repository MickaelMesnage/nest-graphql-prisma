import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { TweetsRepository } from './tweets.repository';
import { TweetsResolver } from './tweets.resolver';
import { TweetsService } from './tweets.service';

@Module({
  imports: [PrismaModule],
  providers: [TweetsRepository, TweetsService, TweetsResolver],
  exports: [TweetsService],
})
export class TweetsModule {}
