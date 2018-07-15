'use strict';

import StoryNode from '../StoryNode.js';

const simpleStoryNode = new StoryNode("1", "0", "1", ["Rumor 1"])

test("Test getEventUid getter", () => {
  expect(simpleStoryNode.getEventUid()).toBe("1");
});
