'use strict';

/**
 * Class used to control what event can be triggered, and randomly generate
 * available event when requested.
 */
export default class EventTriggerManager {

  /**
   * @constructor
   */
  constructor() {

    this._experimentPrereq = {
      "1": {
        eventUid: 1,
        rumorProgress: 0
      },
      "2" : {
        eventUid: 1,
        rumorProgress: 1
      },
      "3" : {
        eventUid: 2,
        convId: 1
      },
      "4" : {
        eventUid: 2,
        convId: 2,
        action: "SELL_GOODS"
      },
      "5" : {
        eventUid: 2,
        rumorProgress: 0
      },
      "6" : {
        eventUid: 2,
        convId: 4,
        action: "CHAT"
      },
      "7" : {
        eventUid: 2,
        convId: 4,
        action: "SELL_GOODS"
      },
      "8" : {
        eventUid: 2,
        convId: 5,
        action: "SPREAD_RUMOR_0"
      },
      "9" : {
        eventUid: 2,
        rumorProgress: 1
      },
      "10" : {
        eventUid: 2,
        convId: 8,
        action: "SPREAD_RUMOR_1"
      },
      "11" : {
        eventUid: 2,
        convId: 8,
        action: "NOTHING"
      },
      "12" : {
        eventUid: 2,
        convId: 8,
        action: "SPREAD_RUMOR_0"
      },
      "13" : {
        eventUid: 2,
        convId: 9
      },
      "14" : {
        eventUid: 2,
        convId: 10
      }
    };

    /** Expected structure:
     * {
     *   <an available eventUid> : <starting conversation id of the event>,
     *    ...
     * }
     */
    this._availEventsData = {};
    // List of prerequisite IDs that the player has fulfilled
    this._fufilledPrereqsData = [];
  }

  /**
   * Randomly choose an event from available event pools and feed the event
   * information back to caller.
   * @param popupEventCallback - call back function that takes a single JS
   * Object as argument.
   * Argument Event object has structure:
   * {
   *    eventUid: {number},
   *    convId: {number}
   * }
   */
  askForPopupEvent(popupEventCallback) {
    popupEventCallback(undefined);
  }
}
