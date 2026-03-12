import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TmdbPaginated,
  MovieSearchResult,
  SeriesSearchResult,
  MovieDetails,
  SeriesDetails,
  ApiError,
  ApiResponse,
} from './tmdb.types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface FetchOptions {
  method: HttpMethod;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
}

@Injectable()
export class TmdbService {
  private readonly defaultTimeout = 10_000;

  constructor(
    private readonly configService: ConfigService,
  ) {}

  private get baseUrl(): string {
    return (
      this.configService.get<string>('TMDB_BASE_URL') ||
      'https://api.themoviedb.org/3'
    );
  }

  public async getTrending(
    mediaType: 'movie' | 'series',
    pageNumber: number,
  ): Promise<
    ApiResponse<TmdbPaginated<MovieSearchResult | SeriesSearchResult>>
  > {
    const mediaTypeParam = mediaType === 'movie' ? 'movie' : 'tv';
    return this.fetchHandler<
      TmdbPaginated<MovieSearchResult | SeriesSearchResult>
    >(`/trending/${mediaTypeParam}/day?page=${pageNumber}`, { method: 'GET' });
  }


  public async search(
    query: string,
    pageNumber: number,
  ): Promise<ApiResponse<TmdbPaginated<MovieSearchResult | SeriesSearchResult>>> {
    return this.fetchHandler<TmdbPaginated<MovieSearchResult | SeriesSearchResult>>(
      `/search/multi?query=${encodeURIComponent(query)}&page=${pageNumber}`,
      { method: 'GET' },
    );
  }

  public async getById(
    id: number,
    mediaType: 'movie' | 'series',
  ): Promise<ApiResponse<MovieDetails | SeriesDetails>> {
    const endpoint = mediaType === 'movie' ? `/movie/${id}` : `/tv/${id}`;
    return this.fetchHandler<MovieDetails | SeriesDetails>(endpoint, { method: 'GET' });
  }

  private async fetchHandler<T>(
    endpoint: string,
    options: FetchOptions,
  ): Promise<ApiResponse<T>> {
    const { method, body, headers, timeout = this.defaultTimeout } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.configService.get<string>('TMDB_API_KEY')}`,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data: T = await response.json();

      if (!response.ok) {
        throw new ApiError(response.status, response.statusText, data);
      }

      return { data, error: null, status: response.status };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          data: null,
          error: `Request timed out after ${timeout}ms`,
          status: 408,
        };
      }
      if (error instanceof ApiError) {
        return { data: null, error: error.message, status: error.status };
      }
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
