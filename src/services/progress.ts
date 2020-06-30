import { arrayRemove, arrayUnion, db } from '@zoonk/firebase/db';
import {
  ChapterProgress,
  Topic,
  TopicProgress,
  UserProgress,
} from '@zoonk/models';
import { sum } from '@zoonk/utils';

export const getTopicProgress = async (
  topic: Topic.Get,
  userId: string,
): Promise<UserProgress.Topic> => {
  const progress = await db.doc(`topics/${topic.id}/progress/${userId}`).get();
  const data = progress.data() as TopicProgress | undefined;

  if (!data) return { progress: 0 };

  const userPosts: number = sum(Object.values(data), 'posts');
  if (userPosts === 0) return { progress: 0 };

  const topicPosts: number = sum(topic.chapterData, 'posts');
  return { progress: (userPosts / topicPosts) * 100 };
};

export const togglePostProgress = (
  postId: string,
  chapterId: string,
  category: 'examples' | 'lessons',
  current: boolean,
  user: string,
): Promise<void> => {
  const data: ChapterProgress.Create = {
    [category]: current ? arrayRemove(postId) : arrayUnion(postId),
  };

  return db
    .doc(`chapters/${chapterId}/progress/${user}`)
    .set(data, { merge: true });
};

export const markPostAsRead = (
  postId: string,
  userId: string,
): Promise<void> => {
  return db
    .doc(`posts/${postId}/progress/${userId}`)
    .set({ read: true }, { merge: true });
};
