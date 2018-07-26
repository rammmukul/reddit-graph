const app = require('express')()
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')
const Twitter = require('twitter')
const options = require('./twitterOptions')
const DataLoader = require('dataloader')

var client = new Twitter(options)

const loaders = {
  tweetsLoader: new DataLoader(async keys =>
    [client.get('statuses/user_timeline', {user_id: keys[0], count: 200})]
  ),
  userLoader: new DataLoader(async keys =>
    [client.get('users/show', {screen_name: keys[0]})]
  ),
  followersLoader: new DataLoader(async keys =>
    [await client.get('followers/list', {user_id: keys[0], count: 200})]
  )
}

app.use('/', graphqlHTTP(() => ({
  context: {...loaders},
  schema,
  graphiql: true
})))

app.listen(8000)
