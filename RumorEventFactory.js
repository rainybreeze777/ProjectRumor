'use strict';

import StoryNode from './StoryNode.js';

/**
 * Class that stores all rumors in the game.
 * If the plot storage system in the future is implemented as a giant database,
 * this class should be changed to be a Database Access Object to read in data
 * Every StoryNode instance needs a reference to this object
 */
export default class RumorEventFactory {

  /**
   * @constructor
   */
  constructor() {
    const fs = require('fs');
    this._rumorEvents = undefined;
    fs.readFile("assets/data/rumorEvents.json", (err, data) => {
      if (err) { throw err; }
      this._rumorEvents = JSON.parse(data);
    });
  }

  /**
   * Get an event's data
   * @param {number} eventUid - the event unique id to obtain evet data
   * @param {number} targetId - the progressId to obtain event data
   * @return {Js Object} - resulting event data
   * @throws {Error} if eventUid is not in the eventData, or
   *         target id is not found in the progression data
   */
  getEvent(eventUid, targetId) {
    let eventObject = this._rumorEvents[eventUid.toString()];
    if (eventObject == null || eventObject == undefined) {
      throw new Error("EventUid not found!");
    }
    for (let eventProgressPoint of eventObject["eventData"]) {
      if (eventProgressPoint["progressId"] == targetId) {
        return eventProgressPoint;
      }
    }

    throw new Error("Target Id is not found in this story!");
    return false;
  }

  /**
   * Get the title of event
   * @param {number} eventUid - the event unique id to obtain title
   * @return {string} - resulting event title
   * @throws {Error} if eventUid is not in the eventData
   */
  getEventTitle(eventUid)
  {
    let eventObject = this._rumorEvents[eventUid.toString()]
    if (eventObject == null || eventObject == undefined) {
      throw new Error("EventUid not found!");
    }
    return eventObject["title"];
  }
}
