import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import { expressMiddleware } from "@apollo/server/express4";
import { makeSchema, fieldAuthorizePlugin } from "nexus";
import { createServer } from "node:http";
import { join } from "node:path";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const { json } = bodyParser;

dotenv.config();

import * as GraphQLScalars from "./api/schema/scalars";
import * as GraphQLQuery from "./api/schema/Query/index";
import * as GraphQLMutation from "./api/schema/Mutation/index";
import * as GraphQLObject from "./api/schema/Object/index";
import * as GraphQLError from "./api/schema/errorHandling";
import * as GraphQLUnion from "./api/schema/union";
import * as GraphQLInterface from "./api/schema/Interface/interface";
import * as GraphQLInput from "./api/schema/Input/index";
import * as GraphQLEnum from "./api/schema/Enum/index";
import * as GraphQLPagination from './api/schema/pagination/index';

import { graphqlUploadExpress } from "graphql-upload-ts";

(async function CapastonProject() {
  const app = express();

  const httpServer = createServer(app);

  const schema = makeSchema({
    types: [
      GraphQLScalars,
      GraphQLObject,
      GraphQLQuery,
      GraphQLMutation,
      GraphQLError,
      GraphQLUnion,
      GraphQLInterface,
      GraphQLInput,
      GraphQLEnum,
      GraphQLPagination,
    ],
    plugins: [fieldAuthorizePlugin()],
    features: {
      abstractTypeStrategies: {
        resolveType: false,
        isTypeOf: false,
      },
    },
    outputs: {
      schema: join(process.cwd(), "./src/api/generate/schema.graphql"),
      typegen: join(process.cwd(), "./src/api/generate/schema.ts"),
    },
  });

  app.use(cookieParser());

  app.use(graphqlUploadExpress());
  const wsSevrer = new WebSocketServer({
    path: "/graphql",
    server: httpServer,
  });

  const serverCleanup = useServer({ schema }, wsSevrer);

  const server = new ApolloServer({
    schema,
    cache: new InMemoryLRUCache(),
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      credentials: true,
      origin: ["https://studio.apollographql.com", "http://localhost:3000"],
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );
  await new Promise(() => {
    httpServer.listen({ port: process.env.PORT || 4000 });
    console.log(`Server is running at http://localhost:4000/graphql 🚀 💻 `);
  });
})();
