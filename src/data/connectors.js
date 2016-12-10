// mocks data
import casual from 'casual'
// SQL database
import Sequelize from 'sequelize'
import _ from 'lodash'
// MongoDB
import Mongoose from 'mongoose'
// REST
import rp from 'request-promise'

/////////////////// SQLite //////////////////////////
const db = new Sequelize('blog', null, null, {
  dialect: 'sqlite',
  storgae: './blog.sqlite'
})

const AuthorModel = db.define('author', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING }
})

const PostModel = db.define('post', {
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING }
})

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      return author.createPost({
        title: `A post by ${author.firstName}`,
        text: casual.sentences(3),
      });
    });
  });
});

const Author = db.models.author;
const Post = db.models.post;
/////////////////// SQLite //////////////////////////


/////////////////// Mongo //////////////////////////
const mongo = Mongoose.connect('mongodb://localhost/views');

const ViewSchema = Mongoose.Schema({
  postId: Number,
  views: Number,
});

const View = Mongoose.model('views', ViewSchema);

// modify the mock data creation to also create some views:
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      return author.createPost({
        title: `A post by ${author.firstName}`,
        text: casual.sentences(3),
      }).then((post) => { // <- the new part starts here
        // create some View mocks
        return View.update(
          { postId: post.id },
          { views: casual.integer(0, 100) },
          { upsert: true });
      });
    });
  });
});
/////////////////// Mongo //////////////////////////

/////////////////// REST //////////////////////////
const FortuneCookie = {
  getOne() {
    return rp('http://fortunecookieapi.com/v1/cookie')
           .then(res => JSON.parse(res))
           .then(res => res[0].fortune.message)
  }
}
/////////////////// REST //////////////////////////

export { Author, Post, View, FortuneCookie };
