const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {

                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password'); // omitting the password   

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },

    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        // input object is passing input type variables defined in typeDefs
        // the properties of the input object will be passed to the savedBooks nested schema under user
        saveBook: async (parent, { input }, context) => {
            if (context.user) {

                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in for this action.');

        },

        removeBook: async (parent, args, context) => {
            if (context.user) {
                const upadatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
                return upadatedUser;
            }
            throw new AuthenticationError('You need to be logged in for this action.');
        }
    }

};

module.exports = resolvers;