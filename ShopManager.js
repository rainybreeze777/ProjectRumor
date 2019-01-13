'use strict';

/**
 * Class that manages everything in regards to the idle shop system
 */
export default class ShopManager {

  constructor() {
    this._incrementAmount = 10;
    this._gold = 0;
    this._tickInterval = 1000; // default to 1 second per tick
    this._tickJob = undefined;
    this._observers = [];
  }

  tick() {
    this._gold += this._incrementAmount;
    for (let cb of this._observers) {
      cb({ 'gold' : this._gold });
    }
  }

  startTicking() {
    this._tickJob = setInterval(() => { this.tick(); }, this._tickInterval);
  }

  stopTicking() {
    clearInterval(this._tickJob);
  }

  addObserver(obCallback) {
    this._observers.push(obCallback);
  }
}
