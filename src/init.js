import i18next from 'i18next'
import * as yup from 'yup'

import { parse } from './helpers/parser.js'
import { watcher } from './helpers/watchers.js'
import en from './locales/en.js'
import ru from './locales/ru.js'

const resources = {
  en: { translation: en },
  ru: { translation: ru },
}

const getErrorType = (e) => {
  if (e.isParsingError) {
    return 'noRss'
  }
  if (e.isNetworkError) {
    return 'network'
  }
  return 'unknown'
}

const loadRss = (url, watchedState) => {
  watchedState.app.status = 'loading'

  return fetch(
    `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
      url,
    )}`,
  )
    .then(res => res.json())
    .then((data) => {
      const { posts, feed } = parse(data)
      feed.url = url
      watchedState.posts.unshift(...posts)
      watchedState.feeds.unshift(feed)

      watchedState.app.error = null
      watchedState.app.status = 'success'
      watchedState.form = {
        status: 'empty',
        error: null,
      }
    })
    .catch((e) => {
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
        e.isNetworkError = true
      }
      watchedState.app.error = getErrorType(e)
      watchedState.app.status = 'failed'
    })
}

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    status: document.querySelector('.status'),
    input: document.querySelector('#rss-input'),
    modal: document.querySelector('.modal'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  }

  const state = {
    feeds: [],
    posts: [],
    form: {
      error: null,
      status: 'empty',
    },
    app: {
      status: '',
      error: '',
    },
    modal: {
      isOpen: false,
      postId: null,
    },
    viewedPosts: new Set(),
  }

  const i18nextInstance = i18next.createInstance()

  return i18nextInstance
    .init({
      lng: 'ru',
      debug: false,
      resources,
    })
    .then(() => {
      const baseUrlSchema = yup.string().url().required()

      const validateUrl = (url, feeds) => {
        const feedUrls = feeds.map(feed => feed.url)
        const actualUrlSchema = baseUrlSchema.notOneOf(feedUrls)
        return actualUrlSchema
          .validate(url)
          .then(() => null)
          .catch(e => e)
      }

      const watchedState = watcher(state, elements, i18nextInstance)

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const url = data.get('url').replace(/\/$/, '')

        validateUrl(url, watchedState.feeds).then((error) => {
          if (!error) {
            watchedState.form = {
              status: 'filled',
              error: null,
            }

            loadRss(url, watchedState).then(() => {
              elements.input.value = ''
            })
          }
          else {
            watchedState.app.status = 'filling'
            watchedState.form = {
              status: 'error',
              error: error.type,
            }
          }
        })
      })

      elements.postsContainer.addEventListener('click', (e) => {
        const id = e.target.dataset.id

        if (!id) return
        watchedState.viewedPosts.add(id)

        if (e.target.tagName === 'A') return
        watchedState.modal.postId = id
      })
    })
}
