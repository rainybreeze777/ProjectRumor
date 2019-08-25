'use strict';

/**
 * Class that access all the dialogue information in the game.
 * Most likely it will either serve as dialogue file I/O class, or
 * a database access object class to retrieve all the dialogues.
 */
export default class DialogueFactory {

  /**
   * @constructor
   */
  constructor() {
    // the top level keys are event IDs, it must match that of the event
    // as listed in RumorEventFactory
    // prereq structure { EventUid : info Js Object }
    const fs = require('fs');
    this._rumorEvents = "";
    this._experimentDialogue = JSON.parse(fs.readFileSync("assets/data/dialogues.json"));

    this._stagedDialogues = null;
    this._dialogueIndex = -1;
    this._parse = require("jsep");
  }

  /**
   * Set the DialogueFactory to focus on a specific event conversation,
   * and get ready to iterate through the dialogues.
   */
  prepareStage(eventUid, conversationId) {
    for (let eventDialogue of this._experimentDialogue) {
      if (eventDialogue.eventUid === eventUid) {
        for (let conv of eventDialogue.conversations) {
          if (conv.convId === conversationId) {
            this._stagedDialogues = conv.dialogues;
            this._dialogueIndex = 0;
            return;
          }
        }

        throw new Error("DialogueFactory couldn't find given conversationId " +
                        conversationId);
      }
    }

    throw new Error("DialogueFactory couldn't find given eventUid " + eventUid);
  }

  /**
   * Gets the next dialogue speaker and text
   */
  getNextDialogue() {

    if (this._stagedDialogues === null) { return null; }

    if (this._dialogueIndex >= this._stagedDialogues.length) {
      return null;
    }

    return this._stagedDialogues[this._dialogueIndex++];
  }

  /**
   *  @param {Js Array of Integers} fulfilledPrereqs - List of prereqs
   *    that have been completed by the player
   *  @param {Js Objects} finishedEventConvs - Js object that records eventUid
   *    and finished conversations within event
   *      {
   *        eventUid <Uid String> : [<finished convId integers>]
   *        ...
   *      }
   *  @return {Js Array of Js Object}
   *  [{
   *    eventUid : <an available eventUid>,
   *    convId : <triggerable conversation id of the event>,
   *   }
   *   ...
   *  ]
   */
  getTriggerableEvents(fulfilledPrereqs, finishedEventConvs) {
    let triggerables = [];
    for (let oneEvent of this._experimentDialogue) {
      for (let oneConv of oneEvent["conversations"]) {
        if (oneConv.type !== "trigger") { continue; }

        let isTriggerable = false;

        if (Object.keys(finishedEventConvs).includes(oneEvent.eventUid)) {
          isTriggerable = !(finishedEventConvs[oneEvent.eventUid]
                              .includes(oneConv.convId))
                          && this._deduceCondTree(this._parse(oneConv.conditions)
                                                  , fulfilledPrereqs);
        } else {
          isTriggerable = oneConv.conditions === undefined;
        }

        if (isTriggerable) {
          triggerables.push({
            eventUid : oneEvent.eventUid,
            convId : oneConv.convId
          });
        }
      }
    }

    return triggerables;
  }

  /**
   *  @param {Js Array of Integers} fulfilledPrereqs - List of prereqs
   *    that have been completed by the player
   *  @param {Js Object} finishedConvs - A Js object that records eventUid and
   *    finished conversations within event
   *    {
   *        eventUid: <Uid String>,
   *        finishedConvIdList: [<integers>]
   *    }
   *  @return {Js Array of Integers} List of available immediate conversations
   */
  getImmediateResponse(fulfilledPrereqs, finishedConvs) {
    let immediates = [];
    let eventUid = finishedConvs.eventUid;

    for (let oneEvent of this._experimentDialogue) {
      if (oneEvent["eventUid"] !== eventUid) { continue; }
      for (let oneConv of oneEvent["conversations"]) {
        if (oneConv.type === "immediate"
            && !finishedConvs.finishedConvIdList.includes(oneConv.convId)
            && this._deduceCondTree(this._parse(oneConv.conditions)
                                    , fulfilledPrereqs)) {
          immediates.push(oneConv.convId);
        }
      }
    }

    return immediates;
  }

  _deduceCondTree(treeNode, fulfilledPrereqs) {
    if (treeNode.type === "Literal") {
      return fulfilledPrereqs.includes(treeNode.value);
    } else if (treeNode.type === "UnaryExpression" && treeNode.operator === "!") {
      return !fulfilledPrereqs.includes(treeNode.argument.value);
    } else if (treeNode.type === "LogicalExpression") {
      if (treeNode.operator === "&&") {
        return this._deduceCondTree(treeNode.left, fulfilledPrereqs)
                && this._deduceCondTree(treeNode.right, fulfilledPrereqs);
      } else if (treeNode.operator === "||") {
        return this._deduceCondTree(treeNode.left, fulfilledPrereqs)
                || this._deduceCondTree(treeNode.right, fulfilledPrereqs);
      } else {
        throw new Error("Unrecognized operator " + treeNode.operator);
      }
    } else {
      throw new Error("Unrecognized condition tree type " + treeNode.type + " token " + treeNode.raw);
    }
  }

}
