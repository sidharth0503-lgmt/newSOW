
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { makeExecutableSchema } from "graphql-tools";
import { applyMiddleware } from "graphql-middleware";
import mercury from "@mercury-js/core";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import * as dotenv from "dotenv";

dotenv.config();
import './models/index';
import "./profiles/index";

import { typeDefs } from './elastic-search/schema';
import resolvers from "./elastic-search/Search.Resolvers";

const PORT: number = parseInt(process.env.PORT || "4001", 10);

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

mercury.addGraphqlSchema(typeDefs, resolvers);
const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs: mercury.typeDefs,
    resolvers: mercury.resolvers,
  })
);

(async function startApolloServer() {
  mercury.connect("mongodb+srv://shashanksonwane305:1IrdhnVfQFmGEenv@cluster0.o9dunyc.mongodb.net/Bharath");

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    introspection: true,
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    rootValue: () => ({
      mercuryResolvers: mercury.resolvers,
    }),
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return { ...req, user: { profile: "ADMIN" } };
      },
    })
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(` Server is  the gvvhjhkl  ready at http://localhost:${PORT}/graphql`);
})();
