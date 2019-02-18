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

    // Expected structure:
    // {
    //   <an available eventUid> : <starting conversation id of the event>,
    //    ...
    // }
    this._availEventsData = {};
    this._completedEventsData = {};
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
