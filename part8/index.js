const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

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
  type Query {
    bookCount: Int!
    authorCount: Int!
    findBook(name: String!): Book
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
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
    }
  },
  /* Author: {
    bookCount: (root) => books.filter(e => e.author === root.name).length
  }, */
  Mutation: {
    addBook: async (root, args) => {
        if (args.title && (args.title.length < 5 || args.title.length > 20 )) {
        throw new GraphQLError('Title must be between 5 and 20 characters', {
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
    editAuthor: async (root, args) => {
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
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4001 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})