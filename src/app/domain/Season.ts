import { Episode } from './Episode';

export interface Season {
  //custom properties
  tv_show_id: number;
  marked_episodes?: number;

  id: number;
  name: string;
  overview?: string;
  poster_path?: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  episodes?: Episode[];
}
