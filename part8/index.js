const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const User = require('./models/user')
const Author = require('./models/Author.js')
const Book = require('./models/Book.js')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type Token {
    value: String!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    findBook(name: String!): Book
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
`

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let result = await Book.find({}).populate('author')
      if (args.author) {
        result = result.filter(e => e.author.name == args.author)
      }
      if (args.genre) {
        result = result.filter(e => e.genres.includes(args.genre))
      }
      return result
    },
    findBook: async (root, args) => await Book.findOne({ title: args.name }).populate('author'),
    allAuthors: async (root, args) => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  /* Author: {
    bookCount: (root) => books.filter(e => e.author === root.name).length
  }, */
  Mutation: {
    addBook: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new GraphQLError('user not authenticated', {
            extensions: {
            code: 'BAD_USER_INPUT',
            }
          })
        }
        if (args.title && (args.title.length < 5 || args.title.length > 40 )) {
        throw new GraphQLError('Title must be between 5 and 40 characters', {
            extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.title
            }
        })
        }
        if (args.author && (args.author.length < 4 || args.author.length > 25 )) {
          throw new GraphQLError('Author must be between 4 and 25 characters', {
              extensions: {
                  code: 'BAD_USER_INPUT',
                  invalidArgs: args.author
              }
          })
          }
      let existingAuthor = await Author.findOne({ name: args.author })
      if (!existingAuthor) {
        const author = new Author({ name: args.author, born: null, bookCount: null })
        try {
          existingAuthor = await author.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      } else {
      }
      const book = new Book({ title: args.title, author: existingAuthor, genres: args.genres, published: args.published })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
      return book
    },
    editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new GraphQLError('user not authenticated', {
            extensions: {
            code: 'BAD_USER_INPUT',
            }
          })
        }
        if (args.setBornTo && args.setBornTo.toString().length != 4 ) {
          throw new GraphQLError('birthyear must be a number of size 4', {
              extensions: {
                  code: 'BAD_USER_INPUT',
                  invalidArgs: args.setBornTo
              }
          })
          }
        const author = await Author.findOne({ name: args.name })
        if (!author) {
          throw new GraphQLError('author cannot be found', {
            extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name
            }
        })
        }
        author.born = args.setBornTo
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Editing number failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
        return author
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return await user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})