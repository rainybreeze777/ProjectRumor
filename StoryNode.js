'use strict';

/**
 * Class that represents the progress of a Story. It contains the event uid,
 * the progressId i.e. the progress of player in this story line, and APIs to
 * retrieve the correct rumor texts
 */
export default class StoryNode {
  /**
   * @constructor
   */
  constructor(rumorDataFatory, eventUid, progressId, nextIds, rumorTexts) {
    this._dataFactory = rumorDataFatory;
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
   * Advance this story. StoryNode will automatically update itself with correct
   * texts
   * @param {number} unused - unused stub param for overriding purposes
   * @return {boolean} true if this storyline has reached the end
   */
  advance(unused) {
    return this._dataFactory.advanceStory(this);
  }
}
