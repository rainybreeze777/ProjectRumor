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
    if (nextLine.advanceRumorProgressId != undefined) {
      this._rumorCatalogue.advanceEvent(this._focusEventUid
                                        , nextLine.advanceRumorProgressId);
      for (let rumorCallback of this._rumorChangeCallbacks) {
        rumorCallback();
      }
    }

    return nextLine;
  }

  addRumorChangeCallBack(callback) {
    this._rumorChangeCallbacks.push(callback);
  }
}
