import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TmdbService } from './tmdb.service';

@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('trending/:mediaType')
  async getTrending(
    @Param('mediaType') mediaType: string,
    @Query('page') page: string = '1',
  ) {
    if (mediaType !== 'movie' && mediaType !== 'series') {
      throw new HttpException(
        'Invalid media type. Must be "movie" or "series"',
        HttpStatus.BAD_REQUEST,
      );
    }

    const pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new HttpException(
        'Page parameter must be a valid positive integer',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.tmdbService.getTrending(
      mediaType as 'movie' | 'series',
      pageNumber,
    );

    if (result.error) {
      throw new HttpException(
        result.error,
        result.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.data;
  }

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('page') page: string = '1',
  ) {
    if (!query || query.trim().length === 0) {
      throw new HttpException(
        'Query parameter is required and cannot be empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    const pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new HttpException(
        'Page parameter must be a valid positive integer',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.tmdbService.search(query.trim(), pageNumber);

    if (result.error) {
      throw new HttpException(
        result.error,
        result.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.data;
  }

  @Get('id/:id/:mediaType')
  async getById(
    @Param('id') id: string,
    @Param('mediaType') mediaType: string,
  ) {
    const mediaId = parseInt(id, 10);
    if (isNaN(mediaId) || mediaId < 1) {
      throw new HttpException(
        'Invalid ID parameter. Must be a valid positive integer',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (mediaType !== 'movie' && mediaType !== 'series') {
      throw new HttpException(
        'Invalid media type. Must be "movie" or "series"',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.tmdbService.getById(
      mediaId,
      mediaType as 'movie' | 'series',
    );

    if (result.error) {
      throw new HttpException(
        result.error,
        result.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.data;
  }
}
