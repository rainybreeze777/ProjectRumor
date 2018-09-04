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
    this._allRumors = new Map();
  }

  /**
   * A function to get list of all spreadable rumors
   * @return {Map} Key: Event unique Id; Value: StoryNode
   */
  getSpreadableRumors() {
    return this._allRumors;
  }

  /**
   * Adds a rumor to the Catalogue
   * @param {StoryNode} rumor - The rumor to be added
   */
  addRumor(rumor) {
    this._allRumors.set(rumor.getEventUid(), rumor);
  }

  /**
   * Wrapper function to advance a story using eventUid
   * @param {uuid} eventUid - the uuid of the event that needs to be advanced
   * @param {number} choice - The choice to advance this event point.
   */
  advanceEvent(eventUid, choice) {
    this._dataFactory.advanceEvent(this._allRumors.get(eventUid), choice);
  }

  /**
   * Method to quickly get the current rumor text for eventUid
   */
  getRumorText(eventUid) {
    return this._allRumors.get(eventUid).getRumorText();
  }

  /**
   * Temp method for testing
   */
   getNextIds(eventUid) {
     return this._allRumors.get(eventUid).getNextIds();
   }
}
