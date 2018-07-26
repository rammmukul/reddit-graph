const graphql = require('graphql')
const Twitter = require('twitter')
const options = require('./twitterOptions')

var client = new Twitter(options)

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
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
      async resolve (parent) {
        return (await client.get('followers/list', {user_id: parent.id})).users
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        type: userType,
        args: {username: {type: GraphQLID}},
        async resolve (_, args) {
          const params = {screen_name: args.username}
          return client.get('users/show', params)
        }
      }
    }
  })
})

module.exports = schema
