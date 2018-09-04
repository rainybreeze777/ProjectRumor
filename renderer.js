// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';

import $ from 'jquery';
import RumorCatalogue from './RumorCatalogue.js';
import RumorEventFactory from './RumorEventFactory.js';

class Renderer {

  constructor() {
    this._rumorEventFactory = new RumorEventFactory();
    this._rumorCatalogue = new RumorCatalogue(this._rumorEventFactory);
    this._selectedEventUId = -1;
  }

  main() {

    this._rumorCatalogue.addRumor(this._rumorEventFactory.createStoryNode(1));

    let eventsDisplay = $('.events');
    let selectedEvent = -1;

    this._rumorCatalogue.getSpreadableRumors().forEach((storyNode, eventUid) => {
      $('<li/>',{
        text: eventUid,
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
  }

  displayRumor(eventUid) {
    $('.rumor_text').text(this._rumorCatalogue.getRumorText(eventUid));
    let next = this._rumorCatalogue.getNextIds(eventUid);
    let choices = $('.choices');
    choices.empty();
    if (typeof(next) == 'number') {
      $('<li/>', { text: next }).appendTo('.choices');
    } else {
      // TODO: output a list of possible choices
    }
  }
}

(new Renderer()).main();
