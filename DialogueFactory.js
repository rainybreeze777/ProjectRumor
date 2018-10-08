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
    // Event dialogues that are used for quick and sweet experimentations, to
    // show that the code works. Needs to be replaced with an actual and robust
    // event system in the future.
    // the top level keys are event IDs, it must match that of the event
    // as listed in RumorEventFactory
    this._experimentDialogue = [
      {
        eventUid: 1,
        conversations: [
          {
            convId: 1,
            dialogues: [
              {
                speaker: 1,
                text: "唉你听说了吗？前天街角当铺的老板好像被人杀了！"
              },
              {
                speaker: 2,
                text: "哇不是吧，我就说怎么看见衙门的人把当铺封了，我还以为是那" +
                      "抠门老板脑子一糊涂，为了拔毛结果犯法了！"
              },
              {
                speaker: 1,
                text: "可不是嘛！听说有位京城的捕快正好经过，遇到这事儿就揽下来" +
                      "了。估计没两天这凶手就要被抓了。"
              },
              {
                speaker: 2,
                text: "好，虽然那老板挺可恶的，但我可不想住在有杀人犯的城里。"
              }
            ]
          },
          {
            convId: 2,
            dialogues: [
              {
                speaker: 1,
                text: "杀那当铺老板的凶手好像是包子铺的王二！街坊邻居都传遍了！"
              },
              {
                speaker: 2,
                text: "咦，王二不是挺好一小伙吗？怎么能做出杀人放火这种事？"
              },
              {
                speaker: 1,
                text: "不知道哇，我昨天还想去买点菜包子来着，结果看门窗紧闭，一" +
                      "个人都没有。我当时还纳闷儿来着，哪儿有大白天不做生意的人" +
                      "呐，没想到居然是跑路了，人影儿都没一个。"
              },
              {
                speaker: 2,
                text: "啧啧，世风日下。"
              }
            ]
          },
          {
            convId: 3,
            dialogues: [
              {
                speaker: 1,
                text: "王二被抓了！"
              },
              {
                speaker: 2,
                text: "是嘛，京城来的捕快办事就是利索，这才几天就破案了。"
              },
              {
                speaker: 1,
                text: "王二也是惨，捕快一路追踪，在城外树林找到他的。那小子为了" +
                      "逃命，饿了三天三夜，已经没力气反抗了。听说被抓的时候，手" +
                      "手里还攥着之前他典当掉的他娘的簪子。"
              },
              {
                speaker: 2,
                text: "簪子？"
              },
              {
                speaker: 1,
                text: "是呀。我舅舅的邻居的儿子是咱城的狱卒，他说他正好管着王二" +
                      "的牢房，王二没事儿就拉着人说他典当了他娘的簪子，后来找当" +
                      "铺老板赎的时候，那老板居然翻了几十倍的价钱，王二脑子一热" +
                      "，就把那雁过拔毛的老板给砍了。"
              },
              {
                speaker: 2,
                text: "我就说，王二那么个老好人，怎么会做出这种事情。那当铺老板" +
                      "真不是个好东西，我看衙门老爷应该还王二一个清白！"
              },
              {
                speaker: 1,
                text: "就是就是！"
              }
            ]
          }
        ]
      }
    ];

    this._stagedDialogues = null;
    this._dialogueIndex = -1;
  }

  /**
   * Set the DialogueFactory to focus on a specific event conversation,
   * and get ready to iterate through the dialogues.
   */
  prepareStage(eventUid, conversationId) {
    for (let eventDialogue of this._experimentDialogue) {
      if (eventDialogue.eventUid == eventUid) {
        for (let conv of eventDialogue.conversations) {
          if (conv.convId == conversationId) {
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

    if (this._stagedDialogues == null) { return null; }

    if (this._dialogueIndex >= this._stagedDialogues.length) {
      return null;
    }

    return this._stagedDialogues[this._dialogueIndex++];
  }

}
