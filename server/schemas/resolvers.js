const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {

  Query: {

    me: async (obj, args, context) => {

      if (context.user) {

        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {

    addUser: async (obj, args) => {

      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    login: async (obj, { email }) => {

      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (obj, { input }, context) => {

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

    removeBook: async (obj, args, context) => {

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