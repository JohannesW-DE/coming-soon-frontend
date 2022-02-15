/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client";

export const GQL_QUERY_COMING_SOON = gql`
  query ComingSoon($from: String!, $to: String!) {
    comingSoon(from: $from, to: $to) {
      from
      to
      matches {
        episode {
          id
          season_number      
          episode_number
          air_date
          name      
          overview
          watched_gql
        }
        tv_show {
          _id
          name
        }
        movie {
          _id
          title
          release_date
          overview
          watched_gql          
        }
      }
    }
  }
`;

