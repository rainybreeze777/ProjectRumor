// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';

import $ from 'jquery';
import RumorCatalogue from './RumorCatalogue.js';
import RumorEventFactory from './RumorEventFactory.js';
import DialogueFactory from './DialogueFactory.js';
import InteractionManager from './InteractionManager.js';

class Renderer {

  constructor() {
    this._rumorEventFactory = new RumorEventFactory();
    this._rumorCatalogue = new RumorCatalogue(this._rumorEventFactory);
    this._dialogueFactory = new DialogueFactory();
    this._interactionManager = new InteractionManager(this._rumorCatalogue
                                                      , this._dialogueFactory);
    this._selectedEventUId = -1;
    this._selectedEventConvId = 0;
  }

  main() {

    this._selectedEventUId = 1;
    this._selectedEventConvId = 0;

    this._interactionManager.addRumorChangeCallBack(() => {
      this.displayRumor(this._selectedEventUId);
    });

    $('.advance_button').click(() => {
      ++this._selectedEventConvId;
    });

    $('.action_focus_button').click(() => {
      this._interactionManager.prepareConversation(this._selectedEventUId
                                                   , this._selectedEventConvId);
    });

    $('.action_listen_button').click(() => {
      let nextDialogue = this._interactionManager.nextConvLine();
      if (nextDialogue != null) {
        $('.speaker').text(nextDialogue.speaker);
        $('.dialogue').text(nextDialogue.text);
      } else {
        $('.speaker').empty();
        $('.dialogue').empty();
      }
    });
  }

  displayRumor(eventUid) {
    let choicesObj = this._rumorCatalogue.getSpreadableRumors(eventUid);
    let choicesDom = $('.choices');
    choicesDom.empty();
    for (let [rumorQuality, rumorText] of Object.entries(choicesObj)) {
      $('<li/>', { text: rumorQuality + ': ' + rumorText }).appendTo(choicesDom);
    }
  }

}

(new Renderer()).main();
