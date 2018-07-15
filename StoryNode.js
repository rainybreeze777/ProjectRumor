'use strict';

/**
 * Class that represents the progress of a Story. It contains the event uid,
 * the progressId i.e. the progress of player in this story line, and APIs to
 * retrieve the correct rumor texts
 */
export default class StoryNode {

  constructor(eventUid, progressId, nextIds, rumorTexts) {
    // if (new.target == StoryNode) {
    //   throw new TypeError("Cannot instantiate StoryNode directly!");
    // }
    this._eventUid = eventUid;
    this._progressId = progressId;
    this._nextIds = nextIds;
    this._rumorTexts = rumorTexts;
  }

  getEventUid() { return this._eventUid; }
  getProgress() { return this._progressId; }
  getType() { return this._nodeType; }
  getRumorText() { return this._rumorTexts; }
}
