const app = require('express')()
const graphqlHandler = require('express-graphql')
const schema = require('./schema')

app.use('/', graphqlHandler({
  schema,
  graphiql: true
}))

app.listen(8000)
