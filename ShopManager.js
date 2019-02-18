'use strict';

/**
 * Class that manages everything in regards to the idle shop system
 */
export default class ShopManager {

  /**
   * @constructor
   */
  constructor(eventTriggerManager) {
    this._incrementAmount = 10;
    this._gold = 0;
    this._tickInterval = 1000; // default to 1 second per tick
    this._tickJob = undefined;
    this._observers = [];
    this._eventTriggerManager = eventTriggerManager;
    this._popupEventsQueue = [];
  }

  tick() {
    this._gold += this._incrementAmount;
    for (let cb of this._observers) {
      cb({ 'gold' : this._gold });
    }
    this._eventTriggerManager.askForPopupEvent(this.recordPopups);
  }

  startTicking() {
    this._tickJob = setInterval(() => { this.tick(); }, this._tickInterval);
  }

  stopTicking() {
    clearInterval(this._tickJob);
    this._tickJob = undefined;
  }

  /**
   * Accepts a popup event and then notify necessary components that there is a
   * new pop up event available.
   * @param {Js object} popupEvent - holds an popup event info
   * {
   *    eventUid: {number},
   *    convId: {number}
   * }
   */
  recordPopups(popupEvent) {
    if (popupEvent == undefined) {
      // Nothing happened during one tick
      return;
    } else {
      this._popupEventsQueue.push(popupEvent);
      // TODO: notify necessary components that new pop up event is available
    }
  }

  addObserver(obCallback) {
    this._observers.push(obCallback);
  }
}
