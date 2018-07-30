const app = require('express')()
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')
const Twitter = require('twitter')
const options = require('./twitterOptions')
const DataLoader = require('dataloader')

var client = new Twitter(options)

const loaders = {
  tweetsLoader: new DataLoader(async ([username]) => {
    setTimeout(() => loaders.tweetsLoader.clearAll(), 60 * 1000)
    return [client.get('statuses/user_timeline', {screen_name: username, count: 200})]
  },
  {batch: false}
  ),
  userLoader: new DataLoader(async ([username]) => {
    setTimeout(() => loaders.userLoader.clearAll(), 60 * 1000)
    return [client.get('users/show', {screen_name: username})]
  },
  {batch: false}
  ),
  followersLoader: new DataLoader(async ([username]) => {
    setTimeout(() => loaders.followersLoader.clearAll(), 60 * 1000)
    return [(await client.get('followers/list', {screen_name: username, count: 200})).users]
  },
  {batch: false}
  )
}

app.use('/', graphqlHTTP(() => ({
  context: {...loaders},
  schema,
  graphiql: true
})))

app.listen(8000)
