const renderPost = (data, isViewed) => {
  const post = document.createElement('div');
  post.className = 'post d-flex justify-content-between align-items-start border-0 border-end-0 mt-3';

  const link = document.createElement('a');
  link.href = data.link;
  link.className = isViewed ? 'fw-normal link-secondary' : 'fw-bold';
  link.textContent = data.title;
  link.setAttribute('target', '_blank');

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-outline-primary btn-sm';
  button.textContent = 'Просмотр';
  button.dataset.id = data.id;

  post.appendChild(link);
  post.appendChild(button);

  return post;
};

export const renderPosts = (state, container) => {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('border-0');

  const title = document.createElement('h2');
  title.classList.add('h4');
  title.textContent = 'Посты';

  wrapper.appendChild(title);

  state.posts.forEach((post) => {
    const isViewed = state.viewedPosts.has(post.id);
    wrapper.appendChild(renderPost(post, isViewed));
  });

  container.appendChild(wrapper);
};
