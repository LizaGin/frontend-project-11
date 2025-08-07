import onChange from 'on-change'
import { renderFeeds } from '../components/feeds'
import { renderPosts } from '../components/posts'
import { renderModal } from '../components/modal'
import { renderStatus } from '../components/status'

export const watcher = (state, elements, i18next) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form':
        renderStatus(
          state.app.status,
          state.form.error,
          elements.status,
          elements.input,
          i18next,
        )
        break
      case 'app.status':
        renderStatus(
          state.app.status,
          state.app.error,
          elements.status,
          elements.input,
          i18next,
        )
        break
      case 'feeds':
        renderFeeds(state.feeds, elements.feedsContainer, i18next)
        break
      case 'posts':
      case 'viewedPosts':
        renderPosts(state, elements.postsContainer, i18next)
        break
      case 'modal.postId': {
        const currenPost = state.posts.find(
          item => item.id === state.modal.postId,
        )
        renderModal(currenPost, elements.modal, state, i18next)
        break
      }
      default:
        break
    }
  })

  return watchedState
}
