/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import _, { flatten, uniq, union } from 'lodash';
import { fetchFile, extractRelationship } from '../../../../utils';

@Injectable()
export class RelationshipService {
  /**
   * Create relationship.
   * @param {string} follower - The name of the follower in the relationship
   * @param {string|string[]} followed - The name(s) of the followed in the relationship
   */
  constructor(
    protected readonly follower: string,
    protected readonly followed: string[],
  ) {
    this.follower = follower;
    this.followed = followed;
  }

  /**
   * Retrieve follower
   * @return {string}
   */
  getFollower() {
    return this.follower;
  }
  /**
   * Retrieve followed
   * @return {string[]} List of followed
   */
  getFollowed() {
    return this.followed;
  }

  /***
   * Gets relationship information from file
   * @param {string} fileName - The name of file containing relationship information
   * @return {string} The relationships contents from file
   */

  static getRelationships(fileName) {
    let relationships = fetchFile(fileName);
    return relationships;
  }

  /***
   * This  method filters out followers from relationships array
   * @param {Relationship[]} relationships - The list of relationships
   * @return {string[]} The names of followers
   */

  static getFollowersFromRelationships(relationships) {
    let followers = relationships.map((relationship) => {
      return relationship.follower;
    });

    return followers;
  }

  /***
   * This  method filters out followed from relationships array
   * @param {Relationship[]} relationships - A list of relationships
   * @return {string[]} The names of those followed
   */

  static getFollowedFromRelationships(relationships) {
    let followed = relationships.map((relationship) => {
      return relationship.followed;
    });

    return followed;
  }

  /**
   * This methods runs through all the relationships followers and followed properties and
   * gets the users from them
   * @param {Relationship[]} relationships - A list of relationships
   * @return {string[]} List of all the names of  users
   */

  static getUsersFromRelationships(relationships) {
    let followers = this.getFollowersFromRelationships(relationships);
    let followed = this.getFollowedFromRelationships(relationships);
    let users = this.populateUsers(followers, followed);

    return users;
  }

  static populateUsers(followers, followed) {
    let newF = followers.filter((val) => val !== undefined);
    let newFd = followed.filter((val) => val !== undefined);
    let users = union(newF, newFd[0]);
    users = flatten(users);
    users = uniq(users).sort();
    return users;
  }

  static updateRelationships(relationships, relationship) {
    let result = this.getRelationshipFollowerIndex(
      relationships,
      relationship.follower,
    );

    if (result !== -1) {
      let currentRelationship = relationships[result];

      let uniqueFollowed = _?.union(
        currentRelationship.followed,
        relationship.followed,
      );
      currentRelationship.followed = uniqueFollowed;
    } else {
      relationships.push(
        new RelationshipService(relationship.follower, relationship.followed),
      );
    }
  }

  /**
   * This method populates relationships from file
   * @param {fileName} fileName - The name of file containing relationship information
   * @return {Relationship[]} List of relationships
   */

  static populateRelationships(fileName) {
    let relationships = [];
    let relationshipsFromFile = this.getRelationships(fileName);

    if (relationshipsFromFile) {
      let filteredRelationships = relationshipsFromFile
        .split('\r\n')
        .filter(Boolean);

      filteredRelationships.forEach((user) => {
        let result = extractRelationship(user);

        if (result) {
          let follower = result[1];
          let followed = result[2].split(/,\s+/);

          let relationship = new RelationshipService(follower, followed);
          this.updateRelationships(relationships, relationship);
        }
      });
    }

    return relationships;
  }

  /**
   * This method returns index of relationships for follower
   * @param {Relationship[]} relationships - A list of relationships
   * @param {string} follower - The name of follower
   * @return {number} Index of relationship
   */

  static getRelationshipFollowerIndex(relationships, follower) {
    let indexOfFollower = relationships.findIndex((item) => {
      return item.follower === follower;
    });

    return indexOfFollower;
  }

  /**
   * This method returns relationships for follower
   * @param {Relationship[]} relationships - A list of relationships
   * @param {string} follower - The name of follower
   * @return {Relationship} Index of relationship
   */

  static getRelationshipByFollower(relationships, follower) {
    return relationships[
      this.getRelationshipFollowerIndex(relationships, follower)
    ];
  }
}
