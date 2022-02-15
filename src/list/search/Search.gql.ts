import { gql } from "@apollo/client";

export const GQL_QUERY_MULTI_SEARCH = gql`
  query MultiSearch($query: String!) {
    multiSearch(query: $query) {
      query
      name
      year
      count
    }
  }
`;

export const GQL_MUTATION_ADD_MOVIE_TO_LIST = gql`
  mutation AddMovieToList($listId: ID!, $movieId: ID!) {
    addMovieToList(listId: $listId, movieId: $movieId) {
      addMovieToList
    }
  }
`;

export const GQL_MUTATION_ADD_TV_SHOW_TO_LIST = gql`
  mutation AddTvShowToList($listId: ID!, $tvShowId: ID!, $season: Int) {
    addTvShowToList(listId: $listId, tvShowId: $tvShowId, season: $season) {
      addTvShowToList
    }
  }
`;

export const GQL_QUERY_SUGGESTIONS = gql`
  query Suggestions($query: String!) {
    suggestions(query: $query) {
      movies {
        _id
        title
        year
        tagline
        popularity
      }
      tvShows {
        _id
        name
        first_air_date
        tagline
        popularity
        seasons {
          air_date
          name
          season_number
        }
      }
    }
  }
`;
