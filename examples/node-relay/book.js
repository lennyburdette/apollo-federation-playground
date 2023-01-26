import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { parse } from "graphql";

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs: parse(readFileSync("book-subgraph.graphqls", "utf-8")),
    resolvers: {
      Query: {
        book() {
          return { bookId: "book-id-1", author: { authorId: "author-id-1" } };
        },
      },
    },
  }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4002 } });
console.log("book", url);
