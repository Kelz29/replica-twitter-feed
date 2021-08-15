/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { MAXIMUM_TWEET_LENGTH } from '../../../../constants';
import _ from 'lodash';
import { fetchFile, extractTweet } from '../../../../utils';

/***
 * This private method fetches tweet information from file
 * @param {string} fileName - The name of file containing tweet information
 * @return {string} The tweet contents from file
 */

let fetchTweets = (fileName) => {
  let tweets = fetchFile(fileName);
  return tweets;
};

/**
 * Class representing tweets
 */
@Injectable()
export class TweetService {
  /* Create a tweet.
   * @param {string} user - The name of the user who made tweet
   * @param {string} message - The message of the tweet
   * @param {number} position - The order of the tweet when it was retrieved
   */
  constructor(
    protected readonly user: string,
    protected readonly message: string,
    protected readonly position: number,
  ) {
    this.user = user;
    this.message = message;
    this.position = position;
  }

  /**
   * Retrieve user
   * @return {string}
   */
  getUser() {
    return this.user;
  }

  /**
   * Retrieve message
   * @return {string}
   */
  getMessage() {
    return this.message;
  }

  /**
   * Retrieve position
   * @return {string}
   */
  getPosition() {
    return this.position;
  }

  /**
   * This methods runs through all the tweets and returns tweets for user
   * @param {Tweet[]} tweets - A list of tweets
   * @param {string} user - The name of a user
   * @return {Tweet[]} List of filtered tweets for user
   */

  static getTweetsByUser(tweets, user) {
    let result = [];

    result = tweets.filter((tweet) => {
      return tweet.user === user;
    });

    return result;
  }

  /**
   * This method sorts tweets by position
   * @param {Tweet[]} tweets - A list of tweets
   * @return {Tweet[]}  A list of tweets
   */

  static sortTweetsByPosition(tweets) {
    tweets.sort(function (a, b) {
      return a.position - b.position;
    });
  }

  /**
   * This method get all tweets for user
   * @param {string[]} users - A list of user names
   * @param {Relationship[]} relationships - A list of relationships
   * @param {Tweet[]} tweets - A list of tweets
   */

  static getAllUserTweets(users, relationships, tweets) {
    let result = [];
    users.forEach((user) => {
      let userTweets = this.getTweetsByUser(tweets, user);
      let followedTweets = this.getFollowedTweetsByUser(
        user,
        relationships,
        tweets,
      );
      userTweets = userTweets.concat(followedTweets);
      this.sortTweetsByPosition(userTweets);
      result[user] = userTweets;
    });

    return result;
  }

  /**
   * This methods runs through all the tweets and returns tweets for users followed
   * @param {string} user - The name of a user
   * @param {Relationship[]} relationships- A list of relationships
   * @param {Tweet[]} tweets - A list of tweets
   * @return {Tweet[]} List of all tweets by users followed
   */

  static getFollowedTweetsByUser(user, relationships, tweets) {
    let result = [];
    let relationshipForFollowed = relationships.filter((relationship) => {
      return relationship.follower === user;
    });

    if (relationshipForFollowed.length) {
      relationshipForFollowed[0]?.followed?.map((followedUser) => {
        let followedUserTweets = TweetService.getTweetsByUser(
          tweets,
          followedUser,
        );
        result = result.concat(followedUserTweets);
      });
    }

    return result;
  }

  /**
   * This method populates tweets from file
   * @param {fileName} - The name of file containing tweet information
   * @return {Tweet[]} List of tweets
   */

  static populateTweets(fileName) {
    let tweetsFromFile = fetchTweets(fileName);
    let tweets = [];
    let filteredTweets = tweetsFromFile.split('\r\n').filter(Boolean);

    filteredTweets.forEach((info, index) => {
      let result = extractTweet(info);
      if (result) {
        let user = result[1];
        let message = result[2];

        tweets.push(this.createTweet(user, message, index));
      }
    });

    return tweets;
  }

  /**
   * This method create a Tweet object
   * @param {user} - The name of user who created tweet
   * @param {message} - The description of tweet
   * @param {position} - The order the tweet was in the file
   * @return {Tweet}
   */

  static createTweet(user, message, position) {
    if (message.length > MAXIMUM_TWEET_LENGTH) {
      message = message.substr(0, MAXIMUM_TWEET_LENGTH);
    }
    let tweet = new TweetService(user, message, position);
    return tweet;
  }
}
