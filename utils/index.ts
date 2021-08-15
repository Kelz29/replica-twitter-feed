import { Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { FOLDER_PATH, RELATIONSHIP_REGEX, TWEET_REGEX } from '../constants';

const consoleLogger = new Logger('Utilities');
/**
 * This method gets the files to process at run time
 * @param fileName
 * @returns
 */
export const fetchFile = (fileName: string) => {
  try {
    const path = join(FOLDER_PATH, fileName);
    consoleLogger.debug(`Fetching data from: ${path}`);
    return readFileSync(path).toString();
  } catch (error) {
    consoleLogger.error('error', error.message);
    throw new Error(error.message);
  }
};
/**
 * This method extracts the tweet using the predefined regex.
 * @param text
 * @returns
 */
export const extractTweet = (text) => {
  return new RegExp(TWEET_REGEX).exec(text);
};
/**
 * This method extracts relationship using our predefined regex.
 * @param text
 * @returns
 */
export const extractRelationship = (text: string) => {
  return new RegExp(RELATIONSHIP_REGEX).exec(text);
};

/**
 * This utility method logs our tweets.
 * @param allUsersTweets
 */
export const logTweets = (allUsersTweets) => {
  //Formats our tweets to be printed
  Object.keys(allUsersTweets).forEach((user) => {
    let message = `${user}\n`;
    allUsersTweets[user].forEach((tweet) => {
      message += `\t@${tweet.user}: ${tweet.message}\n\n`;
    });
    console.log(message);
    return message;
  });
};

export default {
  fetchFile,
  extractTweet,
  extractRelationship,
  logTweets,
};
