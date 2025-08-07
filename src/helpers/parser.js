import { v4 } from 'uuid'
export const parse = (rss) => {
  const parser = new DOMParser()
  const dom = parser.parseFromString(rss.contents, 'application/xml')

  const error = dom.querySelector('parsererror')

  if (error) {
    const parsingError = new Error()
    parsingError.isParsingError = true

    throw parsingError
  }

  const feed = {
    title: dom.querySelector('title')?.textContent,
    description: dom.querySelector('description')?.textContent,
  }

  const posts = []
  dom.querySelectorAll('item').forEach((postEL) => {
    const post = {
      title: postEL.querySelector('title')?.textContent,
      description: postEL.querySelector('description')?.textContent,
      link: postEL.querySelector('link')?.textContent,
      id: v4(),
    }
    posts.push(post)
  })

  return { feed, posts }
}
