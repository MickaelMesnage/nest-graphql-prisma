import { Test } from '@nestjs/testing';
import { TweetsRepository } from './tweets.repository';
import { TweetsService } from './tweets.service';

describe(`TweetsRepository`, () => {
  let tweetsService: TweetsService;
  let mockTweetsRepository: any;

  beforeEach(async () => {
    mockTweetsRepository = {
      createTweet: jest.fn(),
      getTweetsInTheDayForUser: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TweetsService,
        { provide: TweetsRepository, useValue: mockTweetsRepository },
      ],
    }).compile();

    tweetsService = moduleRef.get(TweetsService);
  });

  describe(`createTweet`, () => {
    it(`should create a new tweet`, async () => {
      const data = {
        content: 'A short tweet',
        userId: 1,
      };
      const mockResolvedValue = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };

      mockTweetsRepository.createTweet.mockResolvedValue(mockResolvedValue);
      mockTweetsRepository.getTweetsInTheDayForUser.mockResolvedValue(1);

      // Act
      const createTweet = () => tweetsService.createTweet(data);

      // Assert
      await expect(createTweet()).resolves.toEqual(mockResolvedValue);
    });

    it(`should not be over 80 characters`, async () => {
      // Arrange
      const data = {
        content: `This is a super long tweet over 80 characters This is a super long tweet over 80 characters`,
        userId: 1,
      };

      mockTweetsRepository.getTweetsInTheDayForUser.mockResolvedValue(1);

      // Act
      const createTweet = () => tweetsService.createTweet(data);

      // Assert
      await expect(createTweet()).rejects.toThrow('Tweet exceed 80 chars');
    });

    it(`should not be the third tweets of the day for a user`, async () => {
      // Arrange
      const data = {
        content: 'A short tweet',
        userId: 1,
      };

      mockTweetsRepository.getTweetsInTheDayForUser.mockResolvedValue(2);

      // Act
      const createTweet = () => tweetsService.createTweet(data);

      // Assert
      await expect(createTweet()).rejects.toThrowError(
        'Number of tweets exceeded for today',
      );
    });
  });
});
