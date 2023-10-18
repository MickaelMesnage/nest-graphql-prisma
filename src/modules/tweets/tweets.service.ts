import { Injectable } from '@nestjs/common';
import { Tweet, User } from '@prisma/client';
import { TweetsRepository } from './tweets.repository';

@Injectable()
export class TweetsService {
  constructor(private repository: TweetsRepository) {}

  async createTweet(params: { content: Tweet['content']; userId: User['id'] }) {
    const { content, userId } = params;

    if (content.length > 80) {
      throw new Error(`Tweet exceed 80 chars`);
    }

    // WTF rules: a user cant tweet more than 2 times in a day
    const nbOfTweets = await this.repository.getTweetsInTheDayForUser(userId);

    if (nbOfTweets >= 2) {
      throw new Error('Number of tweets exceeded for today');
    }

    // call repository layer
    const tweet = await this.repository.createTweet({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // do other things in the service layer... e.g. send email of tweet

    return tweet;
  }

  async getTweets() {
    const tweets = await this.repository.getTweets({});
    return tweets;
  }
}
