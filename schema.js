const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = graphql

const userType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {type: GraphQLID},
    id_str: {type: GraphQLString},
    screen_name: {type: GraphQLString},
    location: {type: GraphQLString},
    description: {type: GraphQLString},
    url: {type: GraphQLString},
    name: {type: GraphQLString},
    followers: {
      type: new GraphQLList(userType),
      async resolve ({id}, _, {followersLoader}) {
        return followersLoader.load(id)
      }
    },
    tweets: {
      type: new GraphQLList(tweetType),
      async resolve ({id}, _, {tweetsLoader}) {
        return tweetsLoader.load(id)
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
        args: {username: {type: GraphQLID}},
        async resolve (_, args, {userLoader}) {
          return userLoader.load(args.username)
        }
      },
      tweets: {
        type: new GraphQLList(tweetType),
        args: {id: {type: GraphQLInt}},
        async resolve (_, args, {tweetsLoader}) {
          return tweetsLoader.load(args.id)
        }
      }
    }
  })
})

module.exports = schema
