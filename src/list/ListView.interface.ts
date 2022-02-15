/**
 * gql
 */

// List

export interface IQueryListVars {
  id: string;
}

export interface IQueryList {
  list: {
    name: string;
    description: string;
    is_public: boolean;
    url: string;
    created_at: string;    
    updated_at: string;
    owner: {
      _id: string;
      username: string;
    };
    entries: IListEntry[];
  }
}

interface IListEntry {
  _id: string;
  comment?: string;
  season?: number;  
  position?: number;
  added_at: string;
  movie?: IListEntryMovie;
  tv_show?: IListEntryTvShow;  
}

export interface ReleaseDate {
  iso_3166_1: string;
  release_date: string;
  type: number;
}

export interface IListEntryMovie {
  _id: string;
  tmdb_id: string;
  title: string;
  overview: string;
  tagline: string;  
  genres: string[];
  release_date: string;
  release_dates: ReleaseDate[];
  external_ids: IExternalId[];  
  videos: IVideo[];
  watch_providers_gql: IWatchProvider[];
  watched_gql: boolean;
}

export interface IListEntryTvShow {
  _id: string;
  tmdb_id: string;
  name: string;
  overview: string;  
  tagline: string;  
  genres: string[];  
  first_air_date: string;
  current_season_start_date: string;
  external_ids: IExternalId[];
  videos: IVideo[];
  seasons: ISeason[];  
  watch_providers_gql: IWatchProvider[];  
};

export interface IWatchProvider {
  logo: string;
  display_priority: number;
  iso_3166_1: string;
  name: string;
  type: string;
}

export interface IExternalId {
  id: string;
  name: string;
}

export interface IVideo {
  name: string;
  key: string;
  site: string;
  published_at: string;
  type: string;
}

export interface ISeason {
  air_date: string;
  season_number: number;
  episode_count: number;
  episodes: IEpisode[]; 
}

export interface IEpisode {
  air_date: string;
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  watched_gql: boolean;    
}

// RemoveEntryFromList

export interface IMutationRemoveEntryFromList {
  removeEntryFromList: boolean;
}

export interface IMutationRemoveEntryFromListVars {
  listId: string;
  entryId: string;  
}

// UpdateComment

export interface IMutationUpdateComment {
  updateComment: boolean;
}

export interface IMutationUpdateCommentVars {
  listId: string;
  entryId: string;  
  comment: string;
}

// UpdatePositions

export interface IMutationUpdatePositions {
  updateComment: boolean;
}

export interface IMutationUpdatePositionsVars {
  listId: string;
  ids: string[];  
}

// AddMovieToList

export interface IMutationAddMovieToList {
  addMovieToList: boolean;
}

export interface IMutationAddMovieToListVars {
  listId: string;
  movieId: string;  
}

// AddTvShowToList

export interface IMutationAddTvShowToList {
  addTvShowToList: boolean;
}

export interface IMutationAddTvShowToListVars {
  listId: string;
  tvShowId: string;  
  seasonNumber?: number;
}

// CompareAgainstList

export interface IQueryListAsComparison {
  listAsComparison: {
    entries: [{
      movie?: {
        _id: string;
      }
      tv_show?: {
        _id: string;
      }
      season?: number;
    }];
  }
}

export interface IQueryListAsComparisonVars {
  id: string;
}

/**
 * misc
 */
export interface ICompareListElement {
  id: string;
  season?: number;
}


