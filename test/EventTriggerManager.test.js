'use strict';

import DialogueFactory from '../DialogueFactory.js';
import RumorCatalogue from '../RumorCatalogue.js';
import EventTriggerManager from '../EventTriggerManager.js';

jest.mock('../DialogueFactory');
jest.mock('../RumorCatalogue');

describe("Test _objectIsSubSetOf", () => {

  // Pass in two undefined as we don't need those
  let manager = new EventTriggerManager();

  test("Test all undefined", () => {
    expect(manager._objectIsSubSetOf(undefined, undefined, [])).toBe(true);
  });

  test("Test one undefined", () => {
    expect(manager._objectIsSubSetOf({ k: "v" }, undefined, [])).toBe(false);
    expect(manager._objectIsSubSetOf(undefined, { k: "v" }, [])).toBe(false);
  });

  test("Test basic is subset", () => {
    let subObj1 = {
      k1: "v1"
    };
    let subObj2 = {
      k1: "v1",
      k2: "v2"
    };
    let superObj = {
      k1: "v1",
      k2: "v2",
    };
    expect(manager._objectIsSubSetOf(subObj1, superObj, [])).toBe(true);
    expect(manager._objectIsSubSetOf(subObj2, superObj, [])).toBe(true);
  });

  test("Test basic is not subset", () => {
    let subObj1 = {
      k3: "v3"
    };
    let subObj2 = {
      k1: "v2"
    };
    let subObj3 = {
      k1: "v1",
      k3: "v3"
    };
    let superObj = {
      k1: "v1",
      k2: "v2",
    };
    expect(manager._objectIsSubSetOf(subObj1, superObj, [])).toBe(false);
    expect(manager._objectIsSubSetOf(subObj2, superObj, [])).toBe(false);
    expect(manager._objectIsSubSetOf(subObj3, superObj, [])).toBe(false);
  });

  test("Test nested object", () => {
    let subObj1 = {
      k1: "v1",
      nest1: {
        nestK1: "nestV1"
      }
    };
    let subObj2 = {
      k1: "v1",
      nest1: {
        nestK2: "nestV2"
      }
    };
    let superObj1 = {
      k1: "v1",
      k2: "v2",
      nest1: {
        nestK1: "nestV1"
      }
    };
    let superObj2 = {
      k1: "v1",
      nest1: {
        nestK1: "nestV1"
      },
      nest2: {
        nestK2: "nestV2"
      }
    };
    let superObj3 = {
      k1: "v1",
      k2: "v2",
      nest1: {
        nestK1: "nestV1",
        nestK2: "nestV2"
      }
    };
    expect(manager._objectIsSubSetOf(subObj1, superObj1, [])).toBe(true);
    expect(manager._objectIsSubSetOf(subObj1, superObj2, [])).toBe(true);
    expect(manager._objectIsSubSetOf(subObj1, superObj3, [])).toBe(true);

    expect(manager._objectIsSubSetOf(subObj2, superObj1, [])).toBe(false);
    expect(manager._objectIsSubSetOf(subObj2, superObj2, [])).toBe(false);
    expect(manager._objectIsSubSetOf(subObj2, superObj3, [])).toBe(true);

  });
});

describe("Test performedInteraction", () => {

  let mockGetTriggerableEvents = null;
  let mockGetImmediateResponse = null;
  let mockGetProgressOfEvent = null;
  let factory = null;
  let catalogue = null;

  beforeAll(() => {
    mockGetTriggerableEvents = jest.fn();
    mockGetTriggerableEvents.mockReturnValue(
      [
        {eventUid: "1", convId: 1},
        {eventUid: "2", convId: 1}
      ]);
    mockGetImmediateResponse = jest.fn();
    mockGetImmediateResponse.mockReturnValue([]);

    DialogueFactory.mockImplementation(() => {
      return {
        getTriggerableEvents: mockGetTriggerableEvents,
        getImmediateResponse: mockGetImmediateResponse
      };
    });

    mockGetProgressOfEvent = jest.fn();

    RumorCatalogue.mockImplementation(() => {
      return {
        getProgressOfEvent: mockGetProgressOfEvent
      }
    });

    factory = new DialogueFactory();
    catalogue = new RumorCatalogue();
  });

  beforeEach(() => {
    DialogueFactory.mockClear();
    RumorCatalogue.mockClear();
    mockGetTriggerableEvents.mockClear();
    mockGetProgressOfEvent.mockClear();

    mockGetProgressOfEvent.mockReturnValue(0);
  });

  test("Test basic calls", () => {
    let eventTriggerManager = new EventTriggerManager(factory, catalogue);
    eventTriggerManager.performedInteraction("1", 1, undefined);

    let data = eventTriggerManager._fulfilledPrereqsData;
    expect(data.length).toBe(1);
    expect(data[0]).toBe(1);

    let finConv = eventTriggerManager._finishedConvs;
    expect(Object.keys(finConv).length).toBe(1);
    expect(finConv["1"].length).toBe(1);
    expect(finConv["1"][0]).toBe(1);

    let availEventsData = eventTriggerManager._availEventsData;
    let expectedArray = [
      {eventUid: "1", convId: 1},
      {eventUid: "2", convId: 1}
    ];
    expect(mockGetTriggerableEvents).toHaveBeenCalledTimes(1);
    expect(availEventsData).toEqual(expect.arrayContaining(expectedArray));
  });

  test("Test fulfills no condition", () => {
    mockGetProgressOfEvent.mockReturnValue(undefined);
    let eventTriggerManager = new EventTriggerManager(factory, catalogue);
    eventTriggerManager.performedInteraction("1", 2, undefined);

    let data = eventTriggerManager._fulfilledPrereqsData;
    expect(data.length).toBe(0);

    let finConv = eventTriggerManager._finishedConvs;
    expect(Object.keys(finConv).length).toBe(1);
    expect(finConv["1"].length).toBe(1);
    expect(finConv["1"][0]).toBe(2);
  });

  test("Test fulfills condition with extra unused info", () => {
    let eventTriggerManager = new EventTriggerManager(factory, catalogue);

    eventTriggerManager.performedInteraction("2", 0, "unused");

    let data = eventTriggerManager._fulfilledPrereqsData;
    expect(data.length).toBe(1);
    expect(data[0]).toBe(5);

    let finConv = eventTriggerManager._finishedConvs;
    expect(Object.keys(finConv).length).toBe(1);
    expect(finConv["2"].length).toBe(1);
    expect(finConv["2"][0]).toBe(0);
  });
});
