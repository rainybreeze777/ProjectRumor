'use strict';

import StoryNode from './StoryNode.js';

/**
 * Class that holds the generally available rumors players have obtained
 * throughout game progression. Provides a generic interface to return a list
 * of available rumors to spread when customers ask for rumors
 */
export default class RumorCatalogue {
  /**
   * @constructor
   */
  constructor(rumorDataFatory) {
    this._dataFactory = rumorDataFatory;
    this._allEvents = new Map();
  }

  /**
   * A function to get list of all spreadable rumors
   * @return {Map} Key: Event unique Id; Value: StoryNode
   */
  getAllEvents() {
    return this._allEvents;
  }

  /**
   * Wrapper function to advance a story using eventUid
   * @param {uuid} eventUid - the uuid of the event that needs to be advanced
   * @param {number} targetId - The target id to advance rumor to
   */
  advanceEvent(eventUid, targetId) {
    let eventData = this._dataFactory.getEvent(eventUid, targetId);
    let eventTitle = this._dataFactory.getEventTitle(eventUid);
    let rumorChoices = {};
    for (let rumor of eventData["waysToDescribe"]) {
      rumorChoices[rumor["rumorQuality"]] = rumor["rumorText"];
    }
    this._allEvents[eventUid]
      = new StoryNode(
              eventUid
              , eventTitle
              , eventData["progressId"]
              , rumorChoices);
  }

  /**
   * Determine if the event exists in the RumorCatalogue yet
   * @param {uuid} - the uuid of event in question
   * @return {bool}
   */
  exists(eventUid) {
    return this._allEvents.has(eventUid);
  }

  /**
   * Get the progress of an event
   * @param {uuid} eventUid - the uuid of event in question
   * @return {integer}
   */
  getProgressOfEvent(eventUid) {
    if (this._allEvents[eventUid] == undefined) { return undefined; }
    return this._allEvents[eventUid].getProgress();
  }

  /**
   * Get the progress of an event
   * @param {uuid} eventUid - the uuid of event in question
   * @return {Js object} Key: Rumor Quality; Value: Rumor Text
   */
  getRumorChoices(eventUid) {
    if (this._allEvents[eventUid] == undefined) { return undefined; }
    return this._allEvents[eventUid].getRumorChoiceTexts();
  }
}
