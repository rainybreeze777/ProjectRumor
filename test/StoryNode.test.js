'use strict';

import StoryNode from '../StoryNode.js';

//TODO: mock RumorDataFactory
const simpleStoryNode = new StoryNode(undefined, "1", "0", "1", ["Rumor 1"])

test("Test getEventUid getter", () => {
  expect(simpleStoryNode.getEventUid()).toBe("1");
});

test("Test getProgress getter", () => {
  expect(simpleStoryNode.getProgress()).toBe("0");
});

test("Test getRumorText getter", () => {
  expect(simpleStoryNode.getRumorText()[0]).toBe("Rumor 1");
});

test("Test getType getter", () => {
  expect(simpleStoryNode.getType()).toBe("StoryNode");
});
