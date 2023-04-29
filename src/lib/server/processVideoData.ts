import { Video, VideoLike, VideoBookmark, Prisma, User } from "@prisma/client";
import { VideoData } from "../types/api";

/**
 *
 * @param userId userId of currently authenticated user
 * @returns Include block for Prisma query wherever we need to get a video
 */
export const getVideoInclude = (
  userId?: string
): {
  user: boolean;
  likes: {
    where: Prisma.VideoLikeWhereInput;
  };
  bookmarks: {
    where: Prisma.VideoBookmarkWhereInput;
  };
  _count: {
    select: {
      views: boolean;
      likes: boolean;
    };
  };
} => ({
  user: true,
  likes: {
    where: {
      userId: { equals: userId },
    },
  },
  bookmarks: {
    where: {
      userId: { equals: userId },
    },
  },
  _count: {
    select: {
      views: true,
      likes: true,
    },
  },
});

export type UnprocessedVideoData = (Video & {
  user: User;
  _count: {
    likes: number;
    views: number;
  };
  likes: VideoLike[];
  bookmarks: VideoBookmark[];
})[];

/**
 *
 * @param videos List of videos to process
 * @returns Processed video data in VideoData format
 */
export const processVideoData = (videos: UnprocessedVideoData): VideoData[] =>
  videos.map((video) => ({
    ...video,
    views: video._count.views,
    likes: video._count.likes,
    isBookmarkedByUser: !!video.bookmarks.length,
    isLikedByUser: !!video.likes.length,
  }));
