const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");
const graphQlschema = require("./graphql/schema/index");
const graphQlresolvers = require("./graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/clinic",
  graphqlHTTP({
    schema: graphQlschema,
    rootValue: graphQlresolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@nawab.eerkf.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    throw err;
  });
