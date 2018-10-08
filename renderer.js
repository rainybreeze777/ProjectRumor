// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';

import $ from 'jquery';
import RumorCatalogue from './RumorCatalogue.js';
import RumorEventFactory from './RumorEventFactory.js';
import DialogueFactory from './DialogueFactory.js';

class Renderer {

  constructor() {
    this._rumorEventFactory = new RumorEventFactory();
    this._rumorCatalogue = new RumorCatalogue(this._rumorEventFactory);
    this._dialogueFactory = new DialogueFactory();
    this._selectedEventUId = -1;
  }

  main() {

    this._rumorCatalogue.addRumor(1);
    this._rumorCatalogue.addRumor(2);

    let eventsDisplay = $('.events');
    let selectedEvent = -1;

    this._rumorCatalogue.getAllEvents().forEach((storyNode, eventUid) => {
      $('<li/>',{
        text: storyNode.getStoryTitle(),
        click: () => {
          this._selectedEventUId = eventUid;
          this.displayRumor(eventUid);
        }
      }).appendTo(eventsDisplay);
    }, this);

    $('.advance_button').click(() => {
      this._rumorCatalogue.advanceEvent(this._selectedEventUId, $('.user_choose')[0].value);
      this.displayRumor(this._selectedEventUId);
    });

    let eventUid = 1;
    let conversationId = 0;
    $('.action_listen_button').click(() => {
      let nextDialogue = this._dialogueFactory.getNextDialogue();
      if (nextDialogue == null) {
        ++conversationId;
        this._dialogueFactory.prepareStage(eventUid, conversationId);
        nextDialogue = this._dialogueFactory.getNextDialogue();
      }
      $('.speaker').text(nextDialogue.speaker);
      $('.dialogue').text(nextDialogue.text);
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
