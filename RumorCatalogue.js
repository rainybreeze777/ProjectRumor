'use strict';

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
   * Adds a rumor to the Catalogue
   * @param {number} eventUid - The uid of the rumor to be added
   */
  addRumor(eventUid) {
    this._allEvents.set(eventUid
                        , this._dataFactory.instantiateStoryNode(eventUid));
  }

  /**
   * Wrapper function to advance a story using eventUid
   * @param {uuid} eventUid - the uuid of the event that needs to be advanced
   * @param {number} choice - The choice to advance this event point.
   */
  advanceEvent(eventUid, choice) {
    this._dataFactory.advanceEvent(this._allEvents.get(eventUid), choice);
  }

  /**
   * Get all Choices as JS object
   * @return {Js object} Key: Rumor Quality; Value: Rumor Text
   */
  getSpreadableRumors(eventUid) {
    return this._allEvents.get(eventUid).getRumorChoiceTexts();
  }
}
