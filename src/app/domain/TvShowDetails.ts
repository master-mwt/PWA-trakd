import { Season } from './Season';
import { Episode } from './Episode';
import { Genre } from './Genre';

export interface TvShowDetails {
  id: number;
  name: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  status: string;
  type: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  origin_country: string[];
  original_language?: string;
  original_name?: string;
  number_of_episodes: number;
  number_of_seasons: number;
  genres: Genre[];
  seasons: Season[];
  last_episode_to_air?: Episode;
  next_episode_to_air?: Episode;
}
