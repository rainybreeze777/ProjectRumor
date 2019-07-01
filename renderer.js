// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';

import $ from 'jquery';
import RumorCatalogue from './RumorCatalogue.js';
import RumorEventFactory from './RumorEventFactory.js';
import DialogueFactory from './DialogueFactory.js';
import InteractionManager from './InteractionManager.js';
import ShopManager from './ShopManager.js';
import EventTriggerManager from './EventTriggerManager.js';

class Renderer {

  constructor() {
    this._rumorEventFactory = new RumorEventFactory();
    this._rumorCatalogue = new RumorCatalogue(this._rumorEventFactory);
    this._dialogueFactory = new DialogueFactory();
    this._interactionManager = new InteractionManager(this._rumorCatalogue
                                                      , this._dialogueFactory);
    this._eventTriggerManager = new EventTriggerManager(this._dialogueFactory
                                                        , this._rumorCatalogue);
    this._shopManager = new ShopManager(this._eventTriggerManager);
    this._rumorEventsQueue = [];
    this._currentEventUid = -1;
    this._currentConvUid = -1;
    this._timePaused = false;
  }

  main() {

    // this._selectedEventUId = 2;
    // this._selectedEventConvId = 0;
    //
    // this._interactionManager.addRumorChangeCallBack(() => {
    //   this.displayRumor(this._selectedEventUId);
    // });
    // this._interactionManager.addActionPromptCallBack((actionTagsList) => {
    //   this.displayActions(actionTagsList);
    // });

    // $('.advance_button').click(() => {
    //   ++this._selectedEventConvId;
    // });
    //
    // $('.focus_button').click(() => {
    //   this._interactionManager.prepareConversation(this._selectedEventUId
    //                                                , this._selectedEventConvId);
    // });
    //
    // $('p.dialogue').click(() => {
    //   this.displayDialogue();
    // });

    $('.event_button').attr('disabled', true);
    $('.conversation_interface').attr('hidden', true);

    $('.dialogue').click(() => {
      let nextDialogue = this._interactionManager.nextConvLine();
      // TODO: Read dialogues, eventTriggerManager generating duplicate
      // when asked for available events
      if (nextDialogue != null) {
        if (nextDialogue.actions != undefined) {
          this._changeUiDisplayState(() => {
            for (let actionTag of nextDialogue.actions) {
              let newButton = $('<button/>', { type: "button", text: actionTag });
              if (actionTag == "SPREAD_RUMOR") {

              } else {
                newButton.click(() => {
                  $('div.actions').empty();
                  let nextConvId =
                        this._eventTriggerManager.performedInteraction(
                          this._currentEventUid
                          , this._currentConvUid
                          , actionTag);
                  this._currentConvUid = nextConvId[0]

                  this._changeUiDisplayState(
                        undefined
                        , "CONVERSATION"
                        , () => {
                          this._interactionManager
                                .prepareConversation(this._currentEventUid
                                                     , this._currentConvUid);
                          let nextDialogue = this._interactionManager.nextConvLine();
                          if (nextDialogue != null) {
                            $('.speaker').text(nextDialogue.speaker);
                            $('.dialogue').text(nextDialogue.text);
                          }
                        }
                  );
                });
              }
              newButton.appendTo('div.actions');
            }
          }, "ACTION", undefined);
        } else {
          $('.speaker').text(nextDialogue.speaker);
          $('.dialogue').text(nextDialogue.text);
        }
      } else {
        this._changeUiDisplayState(undefined, "ROUTINE", () => {
          $('.speaker').empty();
          $('.dialogue').empty();
          this._eventTriggerManager
                .performedInteraction(this._currentEventUid
                                      , this._currentConvUid
                                      , undefined);
        });
      }
    });

    $('.event_button').click(() => {
      this._changeUiDisplayState(undefined, "CONVERSATION", () => {
        let initEvent = this._rumorEventsQueue.shift();
        this._currentEventUid = initEvent["eventUid"];
        this._currentConvUid = initEvent["convId"];
        this._interactionManager.prepareConversation(initEvent["eventUid"]
                                                     , initEvent["convId"]);
        let nextDialogue = this._interactionManager.nextConvLine();
        // TODO: Read dialogues, eventTriggerManager generating duplicate
        // when asked for available events
        if (nextDialogue != null) {
          $('.speaker').text(nextDialogue.speaker);
          $('.dialogue').text(nextDialogue.text);
        }
      });
    });

    this._shopManager.addObserver((data) => {
      $('.gold').text(data["gold"]);
    });
    this._shopManager.addPopupEventObserver((popupEventData) => {
      this.showEvent(popupEventData);
    });
    this._shopManager.startTicking();
  }

  displayRumor(eventUid) {
    let choicesObj = this._rumorCatalogue.getSpreadableRumors(eventUid);
    let choicesDom = $('.choices');
    choicesDom.empty();
    for (let [rumorQuality, rumorText] of Object.entries(choicesObj)) {
      $('<li/>', { text: rumorQuality + ': ' + rumorText }).appendTo(choicesDom);
    }
  }

  showEvent(popupEvent) {
    if(popupEvent == undefined) {
      console.log("wtf is wrong with u");
    }
    this._rumorEventsQueue.push(popupEvent);
    $('.event_button').removeAttr('disabled');
  }

  _changeUiDisplayState(beforeDo, toState, thenDo) {
    if (beforeDo != undefined) { beforeDo(); }
    if (toState == "ROUTINE") {
      this._shopManager.startTicking();
      if (this._rumorEventsQueue.length > 0) {
        $('.event_button').removeAttr('disabled');
      }
      $('.conversation_interface').attr('hidden', true);
      $('.actions').attr('hidden', true);
      this._timePaused = false;
    } else if (toState == "CONVERSATION") {
      this._timePaused = true;
      this._shopManager.stopTicking();
      $('.event_button').attr('disabled', true);
      $('.conversation_interface').removeAttr('hidden');
      $('.actions').attr('hidden', true);
    } else if (toState == "ACTION") {
      $('.conversation_interface').attr('hidden', true);
      $('.actions').removeAttr('hidden');
    }
    if (thenDo != undefined) { thenDo(); }
  }
}

(new Renderer()).main();
