export const renderStatus = (status, error, container, inputEl, i18next) => {
  container.innerHTML = ''

  const messageElement = document.createElement('div')
  container.appendChild(messageElement)

  inputEl.classList.remove('is-invalid')
  container.classList.remove('text-danger', 'text-success')

  switch (status) {
    case 'success':
      container.classList.add('text-success')
      messageElement.textContent = i18next.t('success')
      break

    case 'failed':
      container.classList.add('text-danger')
      messageElement.textContent = i18next.t(`errors.${error}`)

      break

    case 'filling':
      if (error) {
        inputEl.classList.add('is-invalid')
        container.classList.add('text-danger')
        messageElement.textContent = i18next.t(`errors.${error}`)
      }
      break

    default:
      break
  }
}
