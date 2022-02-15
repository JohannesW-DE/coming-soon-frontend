import { IEpisode } from './ListView.interface';

export interface IQueryEpisodes {
  episodes: IEpisode[];
}

export interface IQueryEpisodesVars {
  tvShowId: string;
  season: number;
}
