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
    this._currentConvId = -1;
    this._timePaused = false;

    this._allInterfaces = undefined;
  }

  main() {

    $('.event_button').attr('disabled', true);
    $('.conversation_interface').attr('hidden', true);

    this._allInterfaces = [$('.conversation_interface')
                           , $('.actions_interface')
                           , $('.rumors_interface')];

    this._hideAllInterfaces();

    $('.dialogue').click(() => {
      let nextDialogue = this._interactionManager.nextConvLine();
      // TODO: Read dialogues, eventTriggerManager generating duplicate
      // when asked for available events
      if (nextDialogue != null) {
        if (nextDialogue.actions != undefined) {
          this._changeUiDisplayState(() => {
            for (let actionTag of nextDialogue.actions) {
              let newButton = $('<button/>'
                                , { type: "button", text: actionTag });
              if (actionTag == "SPREAD_RUMOR") {
                newButton.click(() => {
                  this._changeUiDisplayState(undefined
                                             , "SPREAD_RUMOR"
                                             , undefined);
                })
              } else {
                newButton.click(() => {
                  this._doAction(actionTag);
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
                                      , this._currentConvId
                                      , undefined);
        });
      }
    });

    $('.event_button').click(() => {
      this._changeUiDisplayState(undefined, "CONVERSATION", () => {
        let initEvent = this._rumorEventsQueue.shift();
        this._currentEventUid = initEvent["eventUid"];
        this._currentConvId = initEvent["convId"];
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

    this._interactionManager.addRumorChangeCallBack(() => {
      this.refreshRumors();
    })
  }

  showEvent(popupEvent) {
    if(popupEvent == undefined) {
      console.log("wtf is wrong with u");
    }
    this._rumorEventsQueue.push(popupEvent);
    $('.event_button').removeAttr('disabled');
  }

  refreshRumors() {
    let choicesDiv = $('div.rumor_choices');
    choicesDiv.empty();
    for (let [eventUid, eventStoryNode] of Object.entries(this._rumorCatalogue
                                                              .getAllEvents())) {
      let rumorDesc = $('<span/>', { text: eventStoryNode.getStoryTitle() });
      choicesDiv.append(rumorDesc);
      for (let [quality, text] of Object.entries(eventStoryNode
                                                  .getRumorChoiceTexts())) {
        let choiceP = $('<p/>', { text: text, class: "rumor_choice" });
        choiceP.click(() => {
          this._doAction("SPREAD_RUMOR", {
            rumorEventUid: eventUid,
            rumorProgressId: eventStoryNode.getProgress(),
            // Stupid loop iteration turns keys into strings
            rumorQuality: parseInt(quality)
          });
        });
        choicesDiv.append(choiceP);
      }
    }
  }

  _changeUiDisplayState(beforeDo, toState, thenDo) {
    if (beforeDo != undefined) { beforeDo(); }
    if (toState == "ROUTINE") {
      this._shopManager.startTicking();
      if (this._rumorEventsQueue.length > 0) {
        $('.event_button').removeAttr('disabled');
      }
      this._hideAllInterfaces();
      this._timePaused = false;
    } else if (toState == "CONVERSATION") {
      this._timePaused = true;
      this._shopManager.stopTicking();
      $('.event_button').attr('disabled', true);
      this._showInterface("conversation_interface");
    } else if (toState == "ACTION") {
      this._showInterface("actions_interface");
    } else if (toState == "SPREAD_RUMOR") {
      this._showInterface("rumors_interface");
    }
    if (thenDo != undefined) { thenDo(); }
  }

  _doAction(actionTag, actionData) {
    $('div.actions').empty();
    let nextConvId =
          this._eventTriggerManager.performedInteraction(
            this._currentEventUid
            , this._currentConvId
            , actionTag
            , actionData);
    this._currentConvId = nextConvId[0];

    this._changeUiDisplayState(
          undefined
          , "CONVERSATION"
          , () => {
            this._interactionManager
                  .prepareConversation(this._currentEventUid
                                       , this._currentConvId);
            let nextDialogue = this._interactionManager.nextConvLine();
            if (nextDialogue != null) {
              $('.speaker').text(nextDialogue.speaker);
              $('.dialogue').text(nextDialogue.text);
            }
          }
    );
  }

  _hideAllInterfaces() {
    for (let i of this._allInterfaces) {
      i.attr('hidden', true);
    }
  }

  _showInterface(interfaceName) {
    this._hideAllInterfaces();
    for (let i of this._allInterfaces) {
      if (i.attr("class") == interfaceName) {
        i.removeAttr('hidden');
      }
    }
  }
}

(new Renderer()).main();
