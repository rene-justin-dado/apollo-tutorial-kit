const typeDefinitions = `
type Query {
  author(firstName: String, lastName: String): Author
  getFortuneCookie: String
}

type Author {
  _id: Int
  firstName: String
  lastName: String
  posts: [Post]
}

type Post {
  _id: Int
  title: String
  content: String
  views: Int
  author: Author
}

schema {
  query: Query
}
`;

export default [typeDefinitions];
