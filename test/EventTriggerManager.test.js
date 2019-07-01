'use strict';

import DialogueFactory from '../DialogueFactory.js';
import RumorCatalogue from '../RumorCatalogue.js';
import EventTriggerManager from '../EventTriggerManager.js';

jest.mock('../DialogueFactory');
jest.mock('../RumorCatalogue');

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
