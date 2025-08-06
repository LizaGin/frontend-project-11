import i18next from 'i18next';
import * as yup from 'yup';

import { parse } from './helpers/parser.js';
import { watcher } from './helpers/watchers.js';
import resources from './locales/ru.js';

const getErrorType = (e) => {
  if (e.isParsingError) {
    return 'noRss';
  }
  if (e.isAxiosError) {
    return 'network';
  }
  return 'unknown';
};

const loadRss = (url, watchedState) => {
  watchedState.app.status = 'loading';

  return fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((res) => res.json())
    .then((data) => {
      const { posts, feed } = parse(data);
      watchedState.posts.unshift(...posts);
      watchedState.feeds.unshift(feed);

      watchedState.app.error = null;
      watchedState.app.status = 'idle';
      watchedState.form = {
        ...watchedState.form,
        status: 'filling',
        error: null,
      };
    })
    .catch((e) => {
      watchedState.app.error = getErrorType(e);
      watchedState.app.status = 'failed';
    });
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#rss-input'),
    modal: document.querySelector('.modal'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  };

  const state = {
    feeds: [],
    posts: [],
    form: {
      error: '',
      state: 'empty',
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
  };

  const i18nextInstance = i18next.createInstance();

  return i18nextInstance
    .init({
      lng: 'ru',
      debug: false,
      resources,
    })
    .then(() => {
      const baseUrlSchema = yup.string().url().required();

      const validateUrl = (url, feeds) => {
        const feedUrls = feeds.map((feed) => feed.url);
        const actualUrlSchema = baseUrlSchema.notOneOf(feedUrls);
        return actualUrlSchema
          .validate(url)
          .then(() => null)
          .catch((e) => e.message);
      };

      const watchedState = watcher(state, elements);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const sourceUrl = data.get('url');
        const url = sourceUrl.replace(/\/$/, '');

        validateUrl(url, watchedState.feeds).then((error) => {
          if (!error) {
            watchedState.form = {
              ...watchedState.form,
              valid: true,
              error: null,
            };
            loadRss(url, watchedState);
          } else {
            watchedState.form = {
              ...watchedState.form,
              valid: false,
              error: error.key,
            };
          }
        });
      });

      elements.postsContainer.addEventListener('click', (e) => {
        const id = e.target.dataset.id;

        if (!id) return;

        watchedState.modal.postId = id;
        watchedState.viewedPosts.add(id);
      });
    });
};
