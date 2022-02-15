/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client";

export const GQL_GET_EPISODES = gql`
  query Episodes($tvShowId: ID!, $season: Int) {
    episodes(tvShowId: $tvShowId, season: $season) {
      id
      air_date
      episode_number
      name
      overview
      watched_gql
    }
  }
`;