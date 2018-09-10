'use strict';

import RumorChoice from './RumorChoice.js';

/**
 * Class that represents the progress of a Story. It contains the event uid,
 * the progressId i.e. the progress of player in this story line, and APIs to
 * retrieve the correct rumor texts
 * There should be a one-to-one mapping relationship between every story in the
 * game plot and every StoryNode instance in the memory, since each StoryNode
 * keeps a record of how far the player has progressed into this plot line.
 */
export default class StoryNode {
  /**
   * @constructor
   */
  constructor(eventUid, storyTitle, progressId, rumorChoices) {
    this._eventUid = eventUid;
    this._storyTitle = storyTitle
    this._progressId = progressId;
    this._rumorChoices = rumorChoices;
  }

  /**
   * Gets Event Uid
   * @return {uuid}
   */
  getEventUid() {
    return this._eventUid;
  }

  /**
   * Gets progress id of this event
   * @return {number}
   */
  getProgress() {
    return this._progressId;
  }

  /**
   * Gets the texts of this story at this progress
   * @return {Js object} Key: Rumor Quality; Value: Rumor Text
   */
  getRumorChoiceTexts() {
    let texts = {};
    for (let choice of this._rumorChoices) {
      texts[choice.getQuality()] = choice.getRumorText();
    }
    return texts;
  }

  /**
   * Gets the next progress point id, given a choice of rumor quality
   * @param {number} quality - the rumor quality that was chosen
   * @return {number} the nextId that links to the next event progress
   * @throws {Error} if given quality is not found
   */
  getNextIdByQuality(quality) {
    for (let choice of this._rumorChoices) {
      if (choice.getQuality() == quality) {
        return choice.getNextId();
      }
    }
    throw new Error("Given rumor quality is not found!");
  }

  /**
   * Gets the title of this story
   * @return {string} the actual title text
   */
  getStoryTitle() {
    return this._storyTitle;
  }

  /**
   * Advance this story node
   * @param {number} newProgressId
   * @param {Array of RumorChoice} newRumorChoices
   */
  advance(newProgressId, newRumorChoices) {
    this._progressId = newProgressId;
    this._rumorChoices = newRumorChoices;
  }
}
