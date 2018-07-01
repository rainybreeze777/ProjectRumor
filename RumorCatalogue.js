'use strict';

/**
 * Class that holds the generally available rumors players have obtained
 * throughout game progression. Provides a generic interface to return a list
 * of available rumors to spread when customers ask for rumors
 */
class RumorCatalogue {
  /**
   * @constructor
   */
  constructor() {
    this._allRumors = new Map();
  }

  /**
   * A function to get list of all spreadable rumors
   * @return {Map} Key: Event unique Id; Value: StoryNode / ChoiceNode
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
}
