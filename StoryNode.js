'use strict';

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
   * @param {number} eventUid
   * @param {string} storyTitle
   * @param {number} progressId
   * @param {Js object} rumorChoices -
   * {
   *    Rumor Quality (number) : Rumor Text (string)
   * }
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
    return this._rumorChoices;
  }

  /**
   * Gets the title of this story
   * @return {string} the actual title text
   */
  getStoryTitle() {
    return this._storyTitle;
  }
}
