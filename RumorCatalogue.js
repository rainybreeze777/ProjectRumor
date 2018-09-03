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

  /**
   * Advance an event's progress
   * @param {uuid} eventUid - the uuid of the event that needs to be advanced
   * @param {number} [choice = -1] - The choice to advance this event point, if
   *        required. Default is -1, and StoryNode will ignore this parameber;
   *        however, passing -1 to a ChoiceNode indicates that an attempt to
   *        advance ChoiceNode without supplying a choice is made, therefore
   *        an error should be thrown
   * @throws {Error} if choice is not provided for ChoiceNode
   */
  advanceEvent(eventUid, choice = -1) {
    this._allRumors[eventUid].advance(choice);
  }
}
