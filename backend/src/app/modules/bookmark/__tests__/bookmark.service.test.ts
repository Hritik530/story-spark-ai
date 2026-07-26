import { BookmarkService } from "../bookmark.service";
import { Bookmark } from "../bookmark.model";
import { Post } from "../../post/post.model";
import { User } from "../../user/user.model";
import { Types } from "mongoose";

jest.mock("../bookmark.model", () => ({
  Bookmark: {
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOneAndDelete: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    aggregate: jest.fn(),
  },
}));

jest.mock("../../post/post.model", () => ({
  Post: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("../../user/user.model", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("../../post/post.utils", () => ({
  verifyPostAccess: jest.fn(),
}));

const mockedBookmark = Bookmark as jest.Mocked<typeof Bookmark>;
const mockedPost = Post as jest.Mocked<typeof Post>;
const mockedUser = User as jest.Mocked<typeof User>;

describe("BookmarkService", () => {
  const mockUserId = new Types.ObjectId();
  const mockStoryId = new Types.ObjectId();
  const mockToken = { email: "test@example.com" } as any;

  const mockUser = {
    _id: mockUserId,
    email: "test@example.com",
  };

  const mockPost = {
    _id: mockStoryId,
    title: "Test Story",
    isDeleted: false,
    isPublished: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUser.findOne.mockResolvedValue(mockUser as any);
    mockedPost.findOne.mockResolvedValue(mockPost as any);
  });

  describe("toggleBookmark", () => {
    it("throws error when user is not found", async () => {
      mockedUser.findOne.mockResolvedValue(null);
      await expect(
        BookmarkService.toggleBookmark(mockStoryId.toString(), mockToken)
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it("throws error when story is not found", async () => {
      mockedPost.findOne.mockResolvedValue(null);
      await expect(
        BookmarkService.toggleBookmark(mockStoryId.toString(), mockToken)
      ).rejects.toMatchObject({ statusCode: 400, message: "Story not found!" });
    });

    it("removes existing bookmark and decrements count", async () => {
      mockedBookmark.findOne.mockResolvedValue({
        _id: new Types.ObjectId(),
        userId: mockUserId,
        storyId: mockStoryId,
      } as any);
      mockedBookmark.findByIdAndDelete.mockResolvedValue({} as any);
      mockedPost.findByIdAndUpdate.mockResolvedValue({} as any);

      const result = await BookmarkService.toggleBookmark(
        mockStoryId.toString(),
        mockToken
      );

      expect(result.isBookmarked).toBe(false);
      expect(result.message).toBe("Bookmark removed");
      expect(mockedBookmark.findByIdAndDelete).toHaveBeenCalled();
    });

    it("creates new bookmark and increments count when not already bookmarked", async () => {
      mockedBookmark.findOne.mockResolvedValue(null);
      mockedBookmark.create.mockResolvedValue({
        _id: new Types.ObjectId(),
      } as any);
      mockedPost.findByIdAndUpdate.mockResolvedValue({} as any);

      const result = await BookmarkService.toggleBookmark(
        mockStoryId.toString(),
        mockToken
      );

      expect(result.isBookmarked).toBe(true);
      expect(result.message).toBe("Story bookmarked!");
      expect(mockedBookmark.create).toHaveBeenCalledWith({
        userId: mockUserId,
        storyId: mockStoryId,
      });
    });
  });

  describe("getBookmarks", () => {
    it("throws error when user is not found", async () => {
      mockedUser.findOne.mockResolvedValue(null);
      await expect(BookmarkService.getBookmarks(mockToken)).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it("returns empty data and total when no bookmarks exist", async () => {
      mockedBookmark.aggregate.mockResolvedValue([]);

      // Build a chainable mock that supports the full Mongoose query chain
      // Service calls: find().populate().populate().sort().skip().limit().project().then()
      const makeQueryChain = (resultArr: any[]) => {
        const chain: any = {};
        chain.populate = jest.fn().mockReturnValue(chain);
        chain.sort = jest.fn().mockReturnValue(chain);
        chain.skip = jest.fn().mockReturnValue(chain);
        chain.limit = jest.fn().mockReturnValue(chain);
        chain.project = jest.fn().mockResolvedValue(resultArr);
        chain.then = function(onFulfilled: (v: any) => void) {
          onFulfilled(resultArr);
          return this;
        };
        chain.catch = function(onRejected: (e: any) => void) {
          return this;
        };
        chain.find = jest.fn().mockReturnValue(chain);
        chain.map = jest.fn().mockReturnValue(resultArr);
        return chain;
      };

      mockedBookmark.find.mockReturnValue(makeQueryChain([]));

      const result = await BookmarkService.getBookmarks(mockToken);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });

  describe("checkBookmarkStatus", () => {
    it("returns isBookmarked true when bookmark exists", async () => {
      mockedBookmark.findOne.mockResolvedValue({
        _id: new Types.ObjectId(),
      } as any);

      const result = await BookmarkService.checkBookmarkStatus(
        mockStoryId.toString(),
        mockToken
      );

      expect(result.isBookmarked).toBe(true);
    });

    it("returns isBookmarked false when no bookmark exists", async () => {
      mockedBookmark.findOne.mockResolvedValue(null);

      const result = await BookmarkService.checkBookmarkStatus(
        mockStoryId.toString(),
        mockToken
      );

      expect(result.isBookmarked).toBe(false);
    });
  });

  describe("deleteBookmark", () => {
    it("removes bookmark and decrements bookmarksCount", async () => {
      mockedBookmark.findOneAndDelete.mockResolvedValue({
        _id: new Types.ObjectId(),
      } as any);
      mockedPost.findByIdAndUpdate.mockResolvedValue({} as any);

      const result = await BookmarkService.deleteBookmark(
        mockStoryId.toString(),
        mockToken
      );

      expect(result.message).toBe("Bookmark removed");
      expect(mockedBookmark.findOneAndDelete).toHaveBeenCalledWith({
        userId: mockUserId,
        storyId: expect.any(Types.ObjectId),
      });
      expect(mockedPost.findByIdAndUpdate).toHaveBeenCalled();
    });

    it("returns bookmark removed even when no bookmark existed", async () => {
      mockedBookmark.findOneAndDelete.mockResolvedValue(null);

      const result = await BookmarkService.deleteBookmark(
        mockStoryId.toString(),
        mockToken
      );

      expect(result.message).toBe("Bookmark removed");
    });
  });
});
