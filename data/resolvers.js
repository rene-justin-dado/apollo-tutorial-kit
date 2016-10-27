import { Author, View, FortuneCookie } from './connectors'

const Resolvers = {
  Query: {
    author(_, args) {
      return Author.find({ where: args })
    },
    getFortuneCookie() {
      return FortuneCookie.getOne()
    },
  },
  Author: {
    posts(author) {
      return author.getPosts()
    },
  },
  Post: {
    author(post) {
      return post.getAuthor()
    },
    views(post) {
      return View.findOne({ postId: post.id })
        .then(view => view.views)
    }
  },
}

export default Resolvers
