export interface Episode {
  //custom properties
  tv_show_id: number;

  id: number;
  name: string;
  overview?: string;
  season_number: number;
  episode_number: number;
  vote_average: number;
  vote_count: number;
  still_path?: string;
  air_date: string;
}
