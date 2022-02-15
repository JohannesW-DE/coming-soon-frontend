export interface IMultiSearchVars {
  query: string;
}

export interface IMultiSearch {
  multiSearch: {
    query: string;
    name: string;
    year: string;
    count: number;
  }
}

export interface IAddMovieToListVars {
  listId: string;
  movieId: string;
}

export interface IAddMovieToList {
  addMovieToList: boolean;
}

export interface IAddTvShowToListVars {
  listId: string;
  tvShowId: string;
  season: number;
}

export interface IAddTvShowToList {
  addTvShowToList: boolean;
}


// GQL_QUERY_SUGGESTIONS

export interface ISuggestionsVars {
  query: string;
}

export interface ISuggestions {
  suggestions: {
    movies: IMovieSuggestion[];
    tvShows: ITvShowSuggestion[];
  }
}

export interface IMovieSuggestion {
  _id: string;
  title: string;
  year: number;
  tagline: string;
  popularity: number;
}

export interface ITvShowSuggestion {
  _id: string;
  name: string;
  first_air_date: string;
  tagline: string;
  popularity: number;  
  seasons: [{
    air_date: string;
    name: string;
    season_number: number;
  }];
}
