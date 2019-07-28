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
    // prereq structure { EventUid : info Js Object }
    this._experimentDialogue = [
      {
        eventUid: "1",
        conversations: [
          {
            convId: 1,
            type: "trigger",
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
                text: "好，虽然那老板挺可恶的，但我可不想住在有杀人犯的城里。",
                advanceRumorProgressId: 0
              }
            ]
          },
          {
            convId: 2,
            type: "trigger",
            conditions: "1",
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
                text: "啧啧，世风日下。",
                advanceRumorProgressId: 1
              }
            ]
          },
          {
            convId: 3,
            type: "trigger",
            conditions: "2",
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
                text: "就是就是！",
                advanceRumorProgressId: 2
              }
            ]
          }
        ]
      },
      {
        eventUid: "2",
        conversations: [
          {
            convId: 1,
            type: "trigger",
            dialogues: [
              {
                speaker: 1,
                text: "给我沽一盅便宜的烧刀子，那杀千刀的不配喝好酒。我家乖孙捡回" +
                      "来的宝贝可不是换给他买酒用的。"
              },
              {
                actions: [
                  "CHAT",
                  "SELL_GOODS"
                ]
              }
            ]
          },
          {
            convId: 2,
            type: "immediate",
            conditions: "3",
            dialogues: [
              {
                speaker: 1,
                text: "你问什么宝贝？我可没说过我家乖孙捡到了一片亮闪闪的大金牌子" +
                      "……快把我的酒给我。",
                advanceRumorProgressId: 0
              },
              {
                actions: [
                  "SELL_GOODS"
                ]
              }
            ]
          },
          {
            convId: 3,
            type: "immediate",
            conditions: "4",
            dialogues: [
              {
                speaker: 1,
                text: "这还差不多，问东问西的……"
              }
            ]
          },
          {
            convId: 4,
            type: "trigger",
            conditions: "5",
            dialogues: [
              {
                speaker: 2,
                text: "给老子来一坛上好的即墨老酒，再来一斤酱牛肉。……那帮没用的" +
                      "家伙弄丢师祖的昆吾令，还得叫老子给他们擦屁股，呸。"
              },
              {
                actions: [
                  "CHAT",
                  "SELL_GOODS"
                ]
              }
            ]
          },
          {
            convId: 5,
            type: "immediate",
            conditions: "6",
            dialogues: [
              {
                speaker: 2,
                text: "老子行不更名坐不改姓，太行山昆吾派第八代首座大弟子薛大方是也！"
              },
              {
                speaker: 2,
                text: "就你还想打探老子的消息？是你应该给老子提供消息才对吧？！"
              },
              {
                actions: [
                  "SELL_GOODS",
                  "SPREAD_RUMOR"
                ]
              }
            ]
          },
          {
            convId: 6,
            type: "immediate",
            conditions: "7",
            dialogues: [
              {
                speaker: 2,
                text: "磨磨唧唧的真他奶奶的慢！"
              }
            ]
          },
          {
            convId: 7,
            type: "immediate",
            conditions: "8",
            dialogues: [
              {
                speaker: 2,
                text: "金子做的牌子，倒像是昆吾令……",
                advanceRumorProgressId: 1
              }
            ]
          },
          {
            convId: 13,
            type: "immediate",
            conditions: "15 && !8",
            dialogues: [
              {
                speaker: 2,
                text: "这都什么鸡毛蒜皮的事情，也给老子说，烦不烦？！上茶上茶！",
              }
            ]
          },
          {
            convId: 8,
            type: "trigger",
            conditions: "9",
            dialogues: [
              {
                speaker: 3,
                text: "店家，最近可有听说关于杏花村西李家的消息？"
              },
              {
                actions: [
                  "NOTHING",
                  "SPREAD_RUMOR"
                ]
              }
            ]
          },
          {
            convId: 9,
            type: "immediate",
            conditions: "11 && !12",
            dialogues: [
              {
                speaker: 3,
                text: "是吗……多谢店家。"
              }
            ]
          },
          {
            convId: 10,
            type: "immediate",
            conditions: "12",
            dialogues: [
              {
                speaker: 3,
                text: "昆吾派首座弟子薛大方？我知道了，多谢店家。"
              }
            ]
          },
          {
            convId: 11,
            type: "trigger",
            conditions: "13",
            dialogues: [
              {
                speaker: 4,
                text: "哎呀听说了吗？隔壁杏花村老李家被杀得一干二净啊！"
              },
              {
                speaker: 5,
                text: "是啊是啊！唉，你说，谁这么丧尽天良，硬是砍死了那一家人！"
              },
              {
                speaker: 4,
                text: "不知道啊……前几天有个刀客模样的人在到处打听李家，听说伤口" +
                      "是剑伤！看样子是武林人士干的。"
              },
              {
                speaker: 5,
                text: "也不知道李家怎的就招惹上了那些恶霸。太惨了。",
                advanceRumorProgressId: 3
              }
            ]
          },
          {
            convId: 12,
            type: "trigger",
            conditions: "14",
            dialogues: [
              {
                speaker: 4,
                text: "哎呀听说了吗？隔壁杏花村老李家被杀得一干二净啊！"
              },
              {
                speaker: 5,
                text: "是啊是啊！不过官府已经发出通缉啦，凶手好像是那昆吾派首座" +
                      "弟子薛大方呐！"
              },
              {
                speaker: 4,
                text: "你小子消息比我还灵啊！这回官府手脚倒是挺快的哈？"
              },
              {
                speaker: 5,
                text: "嘿，官府能干啥？还不是有人得到消息以后，再核对了一下死尸" +
                      "上的剑伤，认定那薛大方就是凶手，直接上报了官府，官府这才" +
                      "匆忙下通缉令。依我看，要不是正好有热心人士愿意管这事，这" +
                      "八成又要成一桩悬案！",
                advanceRumorProgressId: 2
              }
            ]
          }
        ]
      }
    ];

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
