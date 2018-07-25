const graphql = require('graphql')
const Twitter = require('twitter')
const options = require('./twitterOptions')

var client = new Twitter(options)

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema
} = graphql

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'user',
    fields () {
      return {
        name: {
          type: GraphQLString,
          async resolve () {
            const params = {screen_name: 'santoshrajan'}
            return (await client.get('users/show', params)).name
          }
        }
      }
    }
  })
})

module.exports = schema
