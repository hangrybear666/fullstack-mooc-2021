import { gql } from '@apollo/client'
const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`
const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`
const NEW_BOOK = gql`
  mutation createBook($title: String!, $published: Int, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      title
      author
      genres
    }
  }
`

const EDIT_BIRTHYEAR = gql`
  mutation editBirthyear($author: String!, $birthyear: Int!) {
    editAuthor(
      name: $author,
      setBornTo: $birthyear
    ) {
      name
      born
    }
  }
`

export {
    ALL_AUTHORS,
    ALL_BOOKS,
    NEW_BOOK,
    EDIT_BIRTHYEAR
}