import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { parse } from "graphql";

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs: parse(readFileSync("author-subgraph.graphqls", "utf-8")),
    resolvers: {
      Author: {
        __resolveReference(ref) {
          return { ...ref, fullName: `full name ${ref.authorId}` };
        },
      },
    },
  }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4001 } });
console.log("authors", url);
