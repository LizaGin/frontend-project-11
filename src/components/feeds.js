export const renderFeeds = (data, container) => {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('border-0');

  const title = document.createElement('h2');
  title.classList.add('h4');
  title.textContent = 'Фиды';

  const feed = document.createElement('div');
  feed.className = 'border-0';

  const feedTitle = document.createElement('h3');
  feedTitle.className = 'h6 m-0';
  feedTitle.textContent = data.title;

  const feedText = document.createElement('p');
  feedText.className = 'm-0 small text-black-50';
  feedText.textContent = data.description;

  feed.appendChild(feedTitle);
  feed.appendChild(feedText);
  wrapper.appendChild(title);
  wrapper.appendChild(feed);
  container.appendChild(wrapper);
};
