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
   */
  constructor(eventUid, progressId, nextIds, rumorTexts) {
    this._eventUid = eventUid;
    this._progressId = progressId;
    this._nextIds = nextIds;
    this._rumorTexts = rumorTexts;
    this._nodeType = 'StoryNode';
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
   * Gets the type of this node
   * @return {string}
   */
  getType() {
    return this._nodeType;
  }

  /**
   * Gets the texts of this story at this progress
   * @return {string}
   */
  getRumorText() {
    return this._rumorTexts;
  }

  /**
   * Advance this story node
   * @param {number} newProgressId
   * @param {number/Array of numbers} newNextIds
   * @param {string/Array of strings} newRumorTexts
   */
  advance(newProgressId, newNextIds, newRumorTexts) {
    this._progressId = newProgressId;
    this._nextIds = newNextIds;
    this._rumorTexts = newRumorTexts;
    this._nodeType = typeof(this._nextIds) == 'number' ? 'StoryNode'
                                                       : 'ChoiceNode';
  }

  /**
   * Testing method that returns the next Ids
   */
   getNextIds() {
     return this._nextIds;
   }
}
