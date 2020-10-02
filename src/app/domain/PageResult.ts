import { TvShowPreview } from './TvShowPreview';

export interface PageResult {
    page: number;
    results?: TvShowPreview[];
    total_results: number;
    total_pages: number;
}