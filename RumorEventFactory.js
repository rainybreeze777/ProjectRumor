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
    // Events that are used for quick and sweet experimentations, to show that
    // the code works. Needs to be replaced with an actual and robust event
    // system in the future.
    this._experimentEvents = {
      // First one is a linear story, contains 3 story nodes
      "1": {
        "title": "街角当铺命案",
        "eventData": [
          {
            "progressId": 0, // Beginning Node
            "waysToDescribe" : [
              {
                "rumorQuality": 0,
                "rumorText": "街角当铺的老板前天死掉了，衙门来人把店铺全给封了，" +
                              "有位从京城路过的捕快正在调查此事。"
              }
            ]
          },
          {
            "progressId": 1,
            "waysToDescribe" : [
              {
                "rumorQuality": 0,
                "rumorText": "听说好像是街对面卖包子的王二干的，第二天包子铺就关" +
                              "门大吉，王二人不见踪影。"
              }
            ]
          },
          {
            "progressId": 2,
            "waysToDescribe" : [
              {
                "rumorQuality": 0,
                "rumorText": "王二在城外树林里被抓了，饿了三天三夜，捕快找到他的" +
                              "时候已经没力气反抗了，手里还攥着之前他典当掉的他娘" +
                              "的簪子。听狱卒说，王二赎簪子的时候，典当铺老板硬是" +
                              "漫天要价，王二一糊涂，就把典当铺老板砍了。"
              }
            ]
          }
        ]
      },
      "2": {
        "title": "杏花村西李家的好运",
        "eventData": [
          {
            "progressId": 0,
            "waysToDescribe" : [
              {
                "rumorQuality": 0,
                "rumorText": "杏花村西李家老奶奶说漏嘴了，她孙子似乎捡到了一片亮" +
                              "闪闪的大金牌子。"
              }
            ]
          },
          {
            "progressId": 1,
            "waysToDescribe" : [
              {
                "rumorQuality": 0,
                "rumorText": "昆吾派首座弟子薛大方听说了杏花村西李家老奶奶乖孙捡到了一块金牌，" +
                              "说有可能是块昆吾令。"
              },
              {
                "rumorQuality": 1,
                "rumorText": "杏花村西李家老奶奶她乖孙捡到一块金牌，可能是昆吾令。"
              }
            ]
          },
          {
            "progressId": 2,
            "waysToDescribe" : [
              {
                "rumorQuality": 0,
                "rumorText": "杏花村西李家被一夜灭口，妇孺老幼，无一幸免。有人" +
                              "得到消息说昆吾派首座弟子薛大方最近出现在附近并且" +
                              "知道李家捡到了一块可能是昆吾令的金牌，再加上死者" +
                              "都是剑伤，怀疑薛大方就是凶手，并展开了追缉。"
              }
            ]
          },
          {
            "progressId": 3,
            "waysToDescribe" : [
              {
                "rumorQuality": 0,
                "rumorText": "杏花村西李家被一夜灭口，妇孺老幼，无一幸免。凶" +
                              "手用的是剑招，也不知李家平头百姓，如何惹得这般无妄之灾。"
              }
            ]
          }
        ]
      }
    };
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
    let eventObject = this._experimentEvents[eventUid.toString()];
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
    let eventObject = this._experimentEvents[eventUid.toString()]
    if (eventObject == null || eventObject == undefined) {
      throw new Error("EventUid not found!");
    }
    return eventObject["title"];
  }
}
