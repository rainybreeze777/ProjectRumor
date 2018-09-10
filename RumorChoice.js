'use strict';

// Rumor Quality Enums
const R_DETAILED = 0;
const R_CLEAR = 1;

/**
 * Class that represents one possible way of telling others about a rumor
 */
export default class RumorChoice {

  /**
   * @constructor
   */
  constructor(rumorQuality, nextId, rumorText) {
    this._rumorQuality = rumorQuality;
    this._nextId = nextId;
    this._rumorText = rumorText;
  }

  getQuality() {
    return this._rumorQuality;
  }

  getRumorText() {
    return this._rumorText
  }

  getNextId() {
    return this._nextId;
  }
}
