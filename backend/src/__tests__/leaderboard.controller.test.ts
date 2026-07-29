/**
 * leaderboard.controller.test.ts
 *
 * Unit tests for the getWeeklyLeaderboard controller.
 * Tests the weekly aggregation pipeline, scoring, and response shape.
 *
 * Run: pnpm --filter story-spark-ai-backend test -- --colors=false
 */

import { Request, Response } from "express";

jest.mock("../app/modules/post/post.model", () => ({
  Post: {
    aggregate: jest.fn(),
  },
}));

jest.mock("../app/modules/user/user.model", () => ({
  User: {
    findById: jest.fn(),
  },
}));

import { Post } from "../app/modules/post/post.model";
import { User } from "../app/modules/user/user.model";
import { getWeeklyLeaderboard } from "../app/modules/leaderboard/leaderboard.controller";

const mockPostAggregate = Post.aggregate as jest.MockedFunction<typeof Post.aggregate>;
const mockUserFindById = User.findById as jest.MockedFunction<typeof User.findById>;

describe("getWeeklyLeaderboard", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = {};
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it("returns 200 with ranked leaderboard data on success", async () => {
    const now = new Date();
    const userId = { toString: () => "user-123" } as any;

    mockPostAggregate.mockResolvedValueOnce([
      {
        _id: userId,
        storiesCount: 5,
        totalViews: 800,
        totalLikes: 120,
        totalComments: 50,
        creativeScore: 1240,
        userInfo: {
          name: "Jane Doe",
          profile: { avatar: "https://example.com/avatar.png" },
        },
      },
      {
        _id: userId,
        storiesCount: 3,
        totalViews: 300,
        totalLikes: 30,
        totalComments: 10,
        creativeScore: 420,
        userInfo: {
          name: "John Smith",
          profile: { avatar: "" },
        },
      },
    ]);

    await getWeeklyLeaderboard(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "Weekly leaderboard metrics compiled successfully",
      data: [
        {
          rank: 1,
          name: "Jane Doe",
          avatar: "https://example.com/avatar.png",
          storiesCount: 5,
          creativeScore: 1240,
          totalViews: 800,
          totalLikes: 120,
          totalComments: 50,
        },
        {
          rank: 2,
          name: "John Smith",
          avatar: "",
          storiesCount: 3,
          creativeScore: 420,
          totalViews: 300,
          totalLikes: 30,
          totalComments: 10,
        },
      ],
    });
  });

  it("uses Anonymous for users with no userInfo", async () => {
    const userId = { toString: () => "user-456" } as any;

    mockPostAggregate.mockResolvedValueOnce([
      {
        _id: userId,
        storiesCount: 1,
        totalViews: 100,
        totalLikes: 10,
        totalComments: 5,
        creativeScore: 140,
        userInfo: null,
      },
    ]);

    await getWeeklyLeaderboard(mockReq as Request, mockRes as Response);

    const call = jsonMock.mock.calls[0][0];
    expect(call.data[0].name).toBe("Anonymous");
    expect(call.data[0].avatar).toBe("");
  });

  it("returns 200 with empty data when no posts exist", async () => {
    mockPostAggregate.mockResolvedValueOnce([]);

    await getWeeklyLeaderboard(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "Weekly leaderboard metrics compiled successfully",
      data: [],
    });
  });

  it("returns 500 on database error", async () => {
    mockPostAggregate.mockRejectedValueOnce(new Error("DB connection failed"));

    await getWeeklyLeaderboard(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "DB connection failed",
    });
  });

  it("rounds creativeScore to an integer", async () => {
    const userId = { toString: () => "user-789" } as any;

    // creativeScore may come back as a float from aggregation
    mockPostAggregate.mockResolvedValueOnce([
      {
        _id: userId,
        storiesCount: 2,
        totalViews: 500,
        totalLikes: 50,
        totalComments: 20,
        creativeScore: 740.5,
        userInfo: { name: "Alice", profile: { avatar: "https://x.com/a.png" } },
      },
    ]);

    await getWeeklyLeaderboard(mockReq as Request, mockRes as Response);

    const call = jsonMock.mock.calls[0][0];
    expect(call.data[0].creativeScore).toBe(741);
  });
});
