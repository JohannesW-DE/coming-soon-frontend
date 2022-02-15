import { gql } from "@apollo/client";

export const GQL_QUERY_LIST = gql`
query List($id: ID!) {
  list(id: $id) {
    name
    description
    is_public
    url
    created_at
    updated_at
    owner {
      _id
      username
    }
    entries {
      _id
      comment
      season
      position
      added_at   
      movie {
        _id
        tmdb_id
        title
        overview
        tagline        
        genres
        release_date
        release_dates {
          iso_3166_1
          type
          release_date
        }
        videos {
          name
          key
          site
          type
          published_at
        }
        watch_providers_gql {
          logo
          display_priority
          iso_3166_1
          name
          type
        }          
        external_ids {
          id
          name
        }
        watched_gql
      }
      tv_show {
        _id
        tmdb_id
        name
        overview
        tagline
        genres
        first_air_date
        current_season_start_date
        videos {
          name
          key
          site
          type
          published_at
        }
        watch_providers_gql {
          logo
          display_priority
          iso_3166_1
          name
          type
        }        
        external_ids {
          id
          name
        }
        seasons {
          air_date
          season_number
          episode_count
          episodes {
            id
            air_date
            episode_number
            name
            overview
            watched_gql            
          }
        }       
      }     
    }   
  }
}
`;

export const GQL_MUTATION_REMOVE_ENTRY_FROM_LIST = gql`
  mutation RemoveEntryFromList($listId: ID!, $entryId: ID!) {
    removeEntryFromList(listId: $listId, entryId: $entryId)
  }
`;

export const GQL_MUTATION_UPDATE_COMMENT = gql`
  mutation UpdateComment($listId: ID!, $entryId: ID!, $comment: String) {
    updateComment(listId: $listId, entryId: $entryId, comment: $comment)
  }
`;

export const GQL_MUTATION_UPDATE_POSITIONS = gql`
  mutation UpdatePositions($listId: ID!, $ids: [String]) {
    updatePositions(listId: $listId, ids: $ids)
  }
`;

export const GQL_MUTATION_ADD_MOVIE_TO_LIST = gql`
  mutation AddMovieToList($listId: ID!, $movieId: ID!) {
    addMovieToList(listId: $listId, movieId: $movieId)
  }
`;

export const GQL_MUTATION_ADD_TV_SHOW_TO_LIST = gql`
  mutation AddTvShowToList($listId: ID!, $tvShowId: ID!, $seasonNumber: Int) {
    addTvShowToList(listId: $listId, tvShowId: $tvShowId, seasonNumber: $seasonNumber)
  }
`;

export const GQL_QUERY_COMPARE_AGAINST_LIST = gql`
  query ListAsComparison($id: ID!) {
    listAsComparison(id: $id) {
      entries {
        movie {
          _id
        }
        tv_show {
          _id
        }
        season
      }   
    }
  }
`;
