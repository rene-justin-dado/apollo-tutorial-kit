import rp from 'request-promise'
import Mongoose from 'mongoose'
import Sequelize from 'sequelize'
import casual from 'casual'
import _ from 'lodash'

// ##########Connect to SQL############# //
const db = new Sequelize('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite',
})

const AuthorModel = db.define('author', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
})

const PostModel = db.define('post', {
  title: { type: Sequelize.STRING },
  content: { type: Sequelize.STRING },
})

AuthorModel.hasMany(PostModel)
PostModel.belongsTo(AuthorModel)

// create mock data with a seed, so we always get the same
casual.seed(123)
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      return author.createPost({
        title: `A post by ${author.firstName}`,
        content: casual.sentences(3),
      })
    })
  })
})

const Author = db.models.author
const Post = db.models.post
// ###################################### //

// ##########Connect to Mongo########### //
const mongo = Mongoose.connect('mongodb://localhost/views')

const ViewSchema = Mongoose.Schema({
  postId: Number,
  views: Number,
})

const View = Mongoose.model('views', ViewSchema)

// modify the mock data creation to also create some views:
casual.seed(123)
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      return author.createPost({
        title: `A post by ${author.firstName}`,
        content: casual.sentences(3),
      }).then((post) => { // <- the new part starts here
        // create some View mocks
        return View.update(
          { postId: post.id },
          { views: casual.integer(0, 100) },
          { upsert: true })
      })
    })
  })
})
// ###################################### //

// ##########Connect to REST############ //
const FortuneCookie = {
  getOne() {
    return rp('http://quotes.stormconsultancy.co.uk/random.json')
      .then(res => JSON.parse(res))
      .then(res => res.quote)
  }
}
// ###################################### //
export { Author, Post, View, FortuneCookie }
