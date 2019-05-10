'use strict';

import DialogueFactory from '../DialogueFactory.js';

const factory = new DialogueFactory();
const parse = require("jsep");


describe("Test conditional tree deducing logic", () => {

  ///////////////////////////////// Sanity Test ////////////////////////////////
  test("Test empty prereqs", () => {
    let treeNode = parse("1");
    let prereqs = [];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(false);
  });

  test("Test one literal met", () => {
    let treeNode = parse("1");
    let prereqs = [1];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(true);
  });

  test("Test one literal not met", () => {
    let treeNode = parse("1");
    let prereqs = [2];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(false);
  });

  test("Test not with empty prereq", () => {
    let treeNode = parse("!1");
    let prereqs = [];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(true);
  });

  test("Test not with literal met", () => {
    let treeNode = parse("!1");
    let prereqs = [2];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(true);
  });

  test("Test not with literal not met", () => {
    let treeNode = parse("!1");
    let prereqs = [1];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(false);
  });

  ///////////////////////////////// Testing AND ////////////////////////////////

  test("Test 'and' exact match", () => {
    let treeNode = parse("1 && 2");
    let prereqs = [1, 2];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(true);
  });

  test("Test 'and' with extra prereq match", () => {
    let treeNode = parse("1 && 2");
    let prereqs = [1, 2, 3];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(true);
  });

  test("Test 'and' with no match", () => {
    let treeNode = parse("1 && 2");
    let prereqs1 = [1];
    let prereqs2 = [2];
    expect(factory._deduceCondTree(treeNode, prereqs1)).toBe(false);
    expect(factory._deduceCondTree(treeNode, prereqs2)).toBe(false);
  });

  test("Test 'and' with extra but no match", () => {
    let treeNode = parse("1 && 2");
    let prereqs = [1, 3];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(false);
  });


  ///////////////////////////////// Testing OR /////////////////////////////////

  test("Test 'or' exact match", () => {
    let treeNode = parse("1 || 2");
    let prereqs = [1, 2];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(true);
  });

  test("Test 'or' with extra prereq match", () => {
    let treeNode = parse("1 || 2");
    let prereqs = [1, 2, 3];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(true);
  });

  test("Test 'or' with only 1 match", () => {
    let treeNode = parse("1 || 2");
    let prereqs1 = [1];
    let prereqs2 = [2];
    expect(factory._deduceCondTree(treeNode, prereqs1)).toBe(true);
    expect(factory._deduceCondTree(treeNode, prereqs2)).toBe(true);
  });

  test("Test 'or' no match", () => {
    let treeNode = parse("1 || 2");
    let prereqs = [3];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(false);
  });

  test("Test 'or' with 1 match and 1 no match", () => {
    let treeNode = parse("1 || 2");
    let prereqs = [2, 3];
    expect(factory._deduceCondTree(treeNode, prereqs)).toBe(true);
  });

  //////////////////////////// Testing Parenthesis /////////////////////////////

  test("Test operator precedence", () => {
    let treeNode = parse("1 || 2 && 3");
    let prereqs1 = [1];
    expect(factory._deduceCondTree(treeNode, prereqs1)).toBe(true);
    let prereqs2 = [2];
    expect(factory._deduceCondTree(treeNode, prereqs2)).toBe(false);
    let prereqs3 = [3];
    expect(factory._deduceCondTree(treeNode, prereqs3)).toBe(false);
    let prereqs4 = [2, 3];
    expect(factory._deduceCondTree(treeNode, prereqs4)).toBe(true);
    let prereqs5 = [1, 3];
    expect(factory._deduceCondTree(treeNode, prereqs5)).toBe(true);
    let prereqs6 = [1, 2];
    expect(factory._deduceCondTree(treeNode, prereqs6)).toBe(true);
    let prereqs7 = [1, 2, 3];
    expect(factory._deduceCondTree(treeNode, prereqs7)).toBe(true);
  });

  test("Test basic parenthesis", () => {
    let treeNode = parse("(1 || 2) && 3");
    let prereqs1 = [1];
    expect(factory._deduceCondTree(treeNode, prereqs1)).toBe(false);
    let prereqs2 = [2];
    expect(factory._deduceCondTree(treeNode, prereqs2)).toBe(false);
    let prereqs3 = [3];
    expect(factory._deduceCondTree(treeNode, prereqs3)).toBe(false);
    let prereqs4 = [2, 3];
    expect(factory._deduceCondTree(treeNode, prereqs4)).toBe(true);
    let prereqs5 = [1, 3];
    expect(factory._deduceCondTree(treeNode, prereqs5)).toBe(true);
    let prereqs6 = [1, 2];
    expect(factory._deduceCondTree(treeNode, prereqs6)).toBe(false);
    let prereqs7 = [1, 2, 3];
    expect(factory._deduceCondTree(treeNode, prereqs7)).toBe(true);
  });

  test("Test multiple parenthesis", () => {
    let treeNode = parse("(1 || 2) && (3 || 4)");
    let prereqs1 = [1, 3];
    expect(factory._deduceCondTree(treeNode, prereqs1)).toBe(true);
    let prereqs2 = [2, 4];
    expect(factory._deduceCondTree(treeNode, prereqs2)).toBe(true);
    let prereqs3 = [1, 2];
    expect(factory._deduceCondTree(treeNode, prereqs3)).toBe(false);
  });

  test("Test nested parenthesis", () => {
    let treeNode = parse("(1 && (2 || 3) && 4)");
    let prereqs1 = [1, 3];
    expect(factory._deduceCondTree(treeNode, prereqs1)).toBe(false);
    let prereqs2 = [1, 4];
    expect(factory._deduceCondTree(treeNode, prereqs2)).toBe(false);
    let prereqs3 = [2, 4];
    expect(factory._deduceCondTree(treeNode, prereqs3)).toBe(false);
    let prereqs4 = [1, 2, 4];
    expect(factory._deduceCondTree(treeNode, prereqs4)).toBe(true);
  });
});

describe("Test get Triggerable events function", () => {
  test("No fulfilled prereqs", () => {
    let result = factory.getTriggerableEvents([], {});
    let expectedEvents = [
      { eventUid: "1", convId: 1 },
      { eventUid: "2", convId: 1 }
    ];
    for (let oneEvent of result) {
      expect(expectedEvents).toContainEqual(oneEvent);
    }
  });

  test("Event 1 Fulfilled prereq 1 to trigger conversation 2", () => {
    let fulfilledPrereqs = [1];
    let encounteredEvents = { "1" : [1] };

    let result = factory.getTriggerableEvents(fulfilledPrereqs
                                              , encounteredEvents);
    let expectedEvents = [
      { eventUid: "1", convId: 2 },
      { eventUid: "2", convId: 1 }
    ];

    expect(result).toHaveLength(2);
    for (let oneEvent of result) {
      expect(expectedEvents).toContainEqual(oneEvent);
    }
  });

  test("Does not return immediate type conversations", () => {
    let fulfilledPrereqs = [3];
    let encounteredEvents = { "2" : [1] };

    let result = factory.getTriggerableEvents(fulfilledPrereqs
                                              , encounteredEvents);

    let shouldNotReturnEvent = { eventUid: 2, convId: 2 };
    expect(result).not.toContainEqual(shouldNotReturnEvent);
  });
});

describe("Test get Immediate conversations function", () => {
  test("No Fulfilled prereqs", () => {
    expect(factory.getImmediateResponse(
                    [], { eventUid: 1, finishedConvIdList: [] }))
    .toHaveLength(0);
  });

  test("One possible immediate", () => {
    expect(factory.getImmediateResponse(
                    [3], { eventUid: 2, finishedConvIdList: []}))
    .toEqual([2]);
  });

  test("One possible immediate with finished conversations", () => {
    expect(factory.getImmediateResponse(
                    [3, 4], { eventUid: 2, finishedConvIdList: [2]}))
    .toEqual([3]);
  });

  test("One possible immediate with complex conditions", () => {
    expect(factory.getImmediateResponse(
                    [9, 10], { eventUid: 2, finishedConvIdList: []}))
    .toEqual([9]);
  });
});
