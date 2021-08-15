/* eslint-disable prefer-const */
import { Injectable, Logger } from '@nestjs/common';
import { RelationshipService } from '../relationship/relationship.service';
import { TweetService } from '../tweet/tweet.service';
import { logTweets } from '../../../../utils';

export interface IUserInfo {
  username: string;
  follower: IFollowerInfo;
}

interface IFollowerInfo {
  user: string;
  tweet: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    this.logger.error('Hectic');
    return 'Hello World!';
  }

  getTweeting(): IUserInfo[] {
    Logger.log('info', 'Application started.');
    try {
      const relationships =
        RelationshipService.populateRelationships(`user.txt`);

      const tweets = TweetService.populateTweets(`tweet.txt`);
      const users =
        RelationshipService.getUsersFromRelationships(relationships);

      const allUsersTweets = TweetService.getAllUserTweets(
        users,
        relationships,
        tweets,
      );
      const userData: IUserInfo[] = [];
      Object.keys(allUsersTweets).forEach((user, index) => {
        allUsersTweets[user].forEach((tweet) => {
          userData.push({
            username: user,
            follower: {
              user: `@${tweet.user}`,
              tweet: tweet.message,
            },
          });
        });
      });
      //Logs the tweets
      logTweets(allUsersTweets);
      //return Tweets in formatted for FE
      return userData;
    } catch (error) {
      Logger.log('error', error);
    }
  }
}
