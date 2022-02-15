
export interface IComingSoonVars {
  from: string;
  to: string;
}

export interface IComingSoon {
  comingSoon: {
    from: string;
    to: string;
    matches: IComingSoonMatch[];
  }
}

export interface IComingSoonMatch {
  episode?: {
    id: number;
    season_number: number;
    episode_number: number;
    air_date: string;
    name: string;
    overview: string;
    watched_gql: boolean;    
  };
  tv_show?: {
    _id: string;
    name: string;
  };
  movie?: {
    _id: string;
    title: string;
    release_date: string;
    overview: string;
    watched_gql: boolean;    
  };  
}