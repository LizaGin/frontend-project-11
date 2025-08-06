import onChange from 'on-change';
import { renderFeeds } from '../components/feeds';
import { renderPosts } from '../components/posts';
import { renderModal } from '../components/modal';

export const watcher = (state, elements) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'feeds':
        renderFeeds(state.feeds, elements.feedsContainer);
        break;
      case 'posts':
      case 'viewedPosts':
        renderPosts(state, elements.postsContainer);
        break;
      case 'modal.postId': {
        const currenPost = state.posts.find((item) => item.id === state.modal.postId);
        renderModal(currenPost, elements.modal, state);
        break;
      }
      default:
        break;
    }
  });

  return watchedState;
};
