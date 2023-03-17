import { gql } from '@apollo/client'
const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
    }
  }
`
const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`
const BOOKS_BY_GENRE = gql`
query booksByGenre($genre: String) {
  allBooks(genre: $genre) {
    title
    published
    author {
      name
      born
    }
    genres
  }
}
`
const BOOKS_BY_FAVORITE_GENRE = gql`
query booksByGenre($genre: String) {
  allBooks(genre: $genre) {
    title
    published
    author {
      name
      born
    }
    genres
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
      published
      author {
        name
        born
      }
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

const ME = gql`
query {
  me {
    username
    favoriteGenre
  }
}
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export {
    ALL_AUTHORS,
    ALL_BOOKS,
    NEW_BOOK,
    EDIT_BIRTHYEAR,
    LOGIN,
    BOOKS_BY_GENRE,
    BOOKS_BY_FAVORITE_GENRE,
    ME
}