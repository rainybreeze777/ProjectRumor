'use strict';

/**
 * Class used to control what event can be triggered, and randomly generate
 * available event when requested.
 */
export default class EventTriggerManager {

  /**
   * @constructor
   */
  constructor(dialogueFactory, rumorCatalogue) {

    this._experimentPrereqs = [
      {
        prereqId: 1,
        eventUid: "1",
        rumorProgress: 0
      },
      {
        prereqId: 2,
        eventUid: "1",
        rumorProgress: 1
      },
      {
        prereqId: 3,
        eventUid: "2",
        convId: 1
      },
      {
        prereqId: 4,
        eventUid: "2",
        convId: 2,
        action: "SELL_GOODS"
      },
      {
        prereqId: 5,
        eventUid: "2",
        rumorProgress: 0
      },
      {
        prereqId: 6,
        eventUid: "2",
        convId: 4,
        action: "CHAT"
      },
      {
        prereqId: 7,
        eventUid: "2",
        convId: 4,
        action: "SELL_GOODS"
      },
      {
        prereqId: 8,
        eventUid: "2",
        convId: 5,
        action: "SPREAD_RUMOR_0"
      },
      {
        prereqId: 9,
        eventUid: "2",
        rumorProgress: 1
      },
      {
        prereqId: 10,
        eventUid: "2",
        convId: 8,
        action: "SPREAD_RUMOR_1"
      },
      {
        prereqId: 11,
        eventUid: "2",
        convId: 8,
        action: "NOTHING"
      },
      {
        prereqId: 12,
        eventUid: "2",
        convId: 8,
        action: "SPREAD_RUMOR_0"
      },
      {
        prereqId: 13,
        eventUid: "2",
        convId: 9
      },
      {
        prereqId: 14,
        eventUid: "2",
        convId: 10
      }
    ];

    this._dialogueFactory = dialogueFactory;
    this._rumorCatalogue = rumorCatalogue;

    /**
     * Expected structure:
     * [{
     *   eventUid : <an available eventUid>,
     *   convId : <triggerable conversation id of the event>,
     *  }
     *  ...
     * ]
     */
    this._availEventsData = [];
    /**
     * Expected structure:
     * {
     *   eventUid <Uid String> : [<finished convId integers>]
     *   ...
     * }
     */
    this._finishedConvs = {};
    // List of prerequisite IDs that the player has fulfilled
    this._fulfilledPrereqsData = [];
  }

  /**
   * Randomly choose an event from available event pools and feed the event
   * information back to caller.
   * @return {Js Object} with structure
   * {
   *    eventUid: {number},
   *    convId: {number}
   * }
   */
  askForPopupEvent() {
    return this._availEventsData[Math.floor(
                                    Math.random()
                                    * this._availEventsData.length)];
  }

  /**
   * Whenever a conversation has completed, need to call this function so that
   * EventTriggerManager can check if new events are now available
   * @param {eventUid string} eventUid - current engaged event unique id
   * @param {integer} convId - current finished conversation id
   * @param {string} action - current completed action
   *
   * @return {Js Array of Integers} List of available immediate conversations
   */
  performedInteraction(eventUid, convId, action) {
    let performed = {
      eventUid: eventUid,
      convId: convId,
      action: action,
      rumorProgress: this._rumorCatalogue.getProgressOfEvent(eventUid)
    };
    // First deduce if this fulfills any condition
    for (let prereq of this._experimentPrereqs) {
      if (this._fulfilledPrereqsData.includes(prereq["prereqId"])) {
        continue;
      }
      let fulfilled = true;
      for (let prop of Object.getOwnPropertyNames(prereq)) {
        if (prop === "prereqId") { continue; }
        if (prereq[prop] !== performed[prop]) {
          fulfilled = false;
          break;
        }
      }
      if (fulfilled) {
        this._fulfilledPrereqsData.push(prereq["prereqId"]);
      }
    }

    // Then record this as finished conversation
    if (this._finishedConvs[eventUid] === undefined) {
      this._finishedConvs[eventUid] = [];
    }
    this._finishedConvs[eventUid].push(convId);

    // Finally update available events data
    this._availEventsData
      = this._dialogueFactory.getTriggerableEvents(this._fulfilledPrereqsData,
                                                   this._finishedConvs);

    return this._dialogueFactory
                  .getImmediateResponse(
                    this._fulfilledPrereqsData,
                    {
                      eventUid: eventUid,
                      finishedConvIdList: this._finishedConvs[eventUid]
                    });
  }

  initData() {
    this._availEventsData
      = this._dialogueFactory.getTriggerableEvents(this._fulfilledPrereqsData,
                                                   this._finishedConvs);
  }
}
