// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create typeDefs
const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}


type Query {
    me: User
   
}

# using input types to simplify schema
input SaveBookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

# passing input variables as input type to saveBook()
type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth # return Auth object
    saveBook(input: SaveBookInput) :User
    removeBook(bookId: String!) : User
}

type Auth {
    token: ID!
    user: User
}

`;

module.exports = typeDefs;
