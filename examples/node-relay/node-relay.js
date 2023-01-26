import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { parse } from "graphql";

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs: parse(readFileSync("node-relay-subgraph.graphqls", "utf-8")),
    resolvers: {
      Query: {
        node(_, { id }) {
          return JSON.parse(id);
        },
      },
      Author: {
        id(node) {
          return JSON.stringify({
            __typename: "Author",
            authorId: node.authorId,
          });
        },
      },
      Book: {
        id(node) {
          return JSON.stringify({
            __typename: "Book",
            bookId: node.bookId,
            author: { fullName: node.author.fullName },
          });
        },
      },
    },
  }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4003 } });
console.log("node-relay", url);
