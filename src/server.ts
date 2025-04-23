// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import basicAuth from 'express-basic-auth';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { BASIC_AUTH_USER, BASIC_AUTH_PASS } from './config/constants';
import prisma from './db';

dotenv.config();

const app = express();

app.use(
  '/graphql',
  basicAuth({
    users: { [BASIC_AUTH_USER]: BASIC_AUTH_PASS },
    challenge: true,
  })
);

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use('/graphql', express.json(), expressMiddleware(server));

  const httpServer = app.listen(3000, () => {
    console.log('🚀 Server ready at http://localhost:3000/graphql');
  });

  process.on('SIGINT', async () => {
    console.log('Graceful shutdown...');
    await prisma.$disconnect();
    httpServer.close(() => process.exit(0));
  });
}

startApolloServer();

export default app;
