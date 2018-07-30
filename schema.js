const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = graphql

const userType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {type: GraphQLID},
    idString: {
      type: GraphQLString,
      resolve: user => user.id_str
    },
    username: {
      type: GraphQLString,
      resolve: user => user.screen_name
    },
    location: {type: GraphQLString},
    description: {type: GraphQLString},
    url: {type: GraphQLString},
    name: {type: GraphQLString},
    followers: {
      type: new GraphQLList(userType),
      async resolve ({screen_name: username}, _, {followersLoader}) {
        return followersLoader.load(username)
      }
    },
    tweets: {
      type: new GraphQLList(tweetType),
      async resolve ({screen_name: username}, _, {tweetsLoader}) {
        return tweetsLoader.load(username)
      }
    }
  })
})

const tweetType = new GraphQLObjectType({
  name: 'tweet',
  fields: {
    id: {type: GraphQLID},
    text: {type: GraphQLString},
    user: {type: userType},
    truncated: {type: GraphQLBoolean}
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        type: userType,
        description: 'get user profile from username',
        args: {username: {type: GraphQLID}},
        async resolve (_, args, {userLoader}) {
          return userLoader.load(args.username)
        }
      },
      tweets: {
        type: new GraphQLList(tweetType),
        description: 'get tweets of a user from username',
        args: {username: {type: GraphQLID}},
        async resolve (_, args, {tweetsLoader}) {
          return tweetsLoader.load(args.username)
        }
      }
    }
  })
})

module.exports = schema
