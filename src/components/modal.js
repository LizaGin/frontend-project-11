const hideModal = (modal, state) => {
  modal.classList.remove('show');
  modal.style.display = 'none';
  state.modal.postId = null;
};

const onEscKey = (e, modal, state) => {
  if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
    hideModal(modal, state);
    document.removeEventListener('keydown', onEscKey);
  }
};

export const renderModal = (post, modal, state) => {
  const title = modal.querySelector('.modal-title');
  const text = modal.querySelector('.modal-body');
  const link = modal.querySelector('.full-article');

  title.textContent = post.title;
  text.textContent = post.description;
  link.href = post.link;

  modal.classList.add('show');
  modal.style.display = 'block';

  const cross = modal.querySelector('.btn-close');
  const closeButton = modal.querySelector('.btn-secondary');
  cross.addEventListener('click', () => hideModal(modal, state));
  closeButton.addEventListener('click', () => hideModal(modal, state));

  document.addEventListener('keydown', (e) => onEscKey(e, modal, state));
};
