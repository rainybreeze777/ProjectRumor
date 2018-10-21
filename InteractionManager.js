'use strict';

/**
 * Class used to control all interactions between the player and other NPCs
 * Serves as the central point for hooking all subsystems together, faciliating
 * data around
 */
export default class InteractionManager {

  /**
   * @constructor
   */
  constructor(rumorCatalogue, dialogueFactory) {
    this._rumorCatalogue = rumorCatalogue;
    this._dialogueFactory = dialogueFactory;

    this._focusEventUid = -1;

    this._rumorChangeCallbacks = [];
    this._actionPromptCallbacks = [];
    this._choiceNextLineMap = undefined;
  }

  prepareConversation(eventUid, convId) {
    this._dialogueFactory.prepareStage(eventUid, convId);
    this._focusEventUid = eventUid;
  }

  nextConvLine() {
    let nextLine = this._dialogueFactory.getNextDialogue();
    if (nextLine == null) {
      this._focusEventUid = -1;
      return null;
    }
    if (nextLine.actions != undefined) {

      for (let cb of this._actionPromptCallbacks) {
        cb(Object.keys(nextLine.actions));
      }

      this._choiceNextLineMap = {};

      for (let [actionTag, nextLineData] of Object.entries(nextLine.actions)) {
        if (actionTag == "SPREAD_RUMOR") {
          for (let [rumorQuality, nextConvId] of nextLineData) {
            this._choiceNextLineMap[rumorQuality] = nextConvId;
          }
        } else {
          this._choiceNextLineMap[actionTag] = nextLineData;
        }
      }

    } else if (nextLine.advanceRumorQuality != undefined) {
      if (!this._rumorCatalogue.exists(this._focusEventUid)) {
        this._rumorCatalogue.addRumor(this._focusEventUid);
      } else {
        this._rumorCatalogue.advanceEvent(this._focusEventUid
                                          , nextLine.advanceRumorQuality);
      }
      for (let rumorCallback of this._rumorChangeCallbacks) {
        rumorCallback();
      }
    }

    return nextLine;
  }

  addRumorChangeCallBack(callback) {
    this._rumorChangeCallbacks.push(callback);
  }

  addActionPromptCallBack(promptCallback) {
    this._actionPromptCallbacks.push(promptCallback);
  }

  chooseAction(actionTag, actionData) {
    switch(actionTag) {
      case "SPREAD_RUMOR":
        this.prepareConversation(
              this._focusEventUid,
              this._choiceNextLineMap[actionData.toString()]);
        break;
      case "CHAT":
      case "SELL_GOODS":
        this.prepareConversation(
              this._focusEventUid,
              this._choiceNextLineMap[actionTag]);
        break;
      default:
        throw new Error("Action Tag " + actionTag + " is not implemented!");
    }
  }

}
