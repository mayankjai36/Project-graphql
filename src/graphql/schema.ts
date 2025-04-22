import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    metricsSummary(startDate: String!, endDate: String!): MetricsSummary!
  }

  type MetricsSummary {
    sumClicks: Int!
    sumImpressions: Int!
    avgCtr: Float!
    avgPosition: Float!
  }
`;
