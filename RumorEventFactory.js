'use strict';

import StoryNode from './StoryNode.js';

/**
 * Class that stores all rumors in the game, and is responsible for populating
 * and advancing StoryNodes.
 * If the plot storage system in the future is implemented as a giant database,
 * this class should be changed to be a Database Access Object to read in data
 * Every StoryNode instance needs a reference to this object
 */
export default class RumorEventFactory {

  /**
   * @constructor
   */
  constructor() {
    // Events that are used for quick and sweet experimentations, to show that
    // the code works. Needs to be replaced with an actual and robust event
    // system in the future.
    this._experimentEvents = {
      // First one is a linear story, contains 3 story nodes
      "1": {
        "eventData": [
          {
            "progressId": 0, // Beginning Node
            "nextIds": 1,
            "rumorTexts": "街角当铺的老板前天死掉了，衙门来人把店铺全给封了，" +
                          "有位从京城路过的捕快正在调查此事。"
          },
          {
            "progressId": 1,
            "nextIds": 2,
            "rumorTexts": "听说好像是街对面卖包子的王二干的，第二天包子铺就关" +
                          "门大吉，王二人不见踪影。"
          },
          {
            "progressId": 2,
            "nextIds": -1,
            "rumorTexts": "王二在城外树林里被抓了，饿了三天三夜，捕快找到他的" +
                          "时候已经没力气反抗了，手里还攥着之前他典当掉的他娘" +
                          "的簪子。听狱卒说，王二赎簪子的时候，典当铺老板硬是" +
                          "漫天要价，王二一糊涂，就把典当铺老板砍了。"
          },
        ]
      }
    };
  }

  /**
   * Advance an event's progress
   * @param {StoryNode} nodeToAdvance - the story/choice node instance that
   *        needs to be advanced
   * @param {number} choice - The choice to advance this event point.
   * @return {bool} - true if the story is advanced, false if story is concluded
   *         or eventUid is not found
   * @throws {Error} if eventUid is not in the eventData, or
   *         supplied choice is not found in the progression data
   */
  advanceEvent(nodeToAdvance, choice) {
    if (choice == -1) { return false; } // Ignore concluded event

    let eventData = this._getEventData(nodeToAdvance.getEventUid());
    if (eventData == null) {
      throw new Error("EventUid not found in event data!");
    }
    for (let eventProgressPoint of eventData) {
      if (eventProgressPoint["progressId"] == choice) {
        nodeToAdvance.advance(eventProgressPoint["progressId"]
                              , eventProgressPoint["nextIds"]
                              , eventProgressPoint["rumorTexts"]);

        return true;
      }
    }

    throw new Error("Supplied Choice is not found in this story!");
    return false;
  }

  /**
   * Function to create a new StoryNode instance with given event
   * @param {number} eventUid - the event uid of desired story
   * @return {StoryNode} - the new instance of StoryNode
   * @throws {Error} if eventUid is not found in the eventData
   */
  createStoryNode(eventUid) {
    const startId = 0;
    let eventData = this._getEventData(eventUid);
    if (eventData == null) {
      throw new Error("EventUid not found in event data!");
    }
    for (let eventProgressPoint of eventData) {
      if (eventProgressPoint["progressId"] == startId) {
        return new StoryNode(eventUid
                             , startId
                             , eventProgressPoint["nextIds"]
                             , eventProgressPoint["rumorTexts"]);
      }
    }
  }

//==============================================================================
// Private Methods
//==============================================================================

  /**
   * Gets the event data from event uid
   * @param {number} eventUid
   * @return {Array of JS object}
   */
  _getEventData(eventUid) {
    return this._experimentEvents[eventUid.toString()]["eventData"];
  }

}
