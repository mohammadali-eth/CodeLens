/// <reference types="jest" />

import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetReviewUseCase } from './get-review.use-case';
import { IReviewRepository } from '../ports/review-repository.interface';
import { Review } from '../../domain/review.entity';

describe('GetReviewUseCase', () => {
  let useCase: GetReviewUseCase;
  let mockReviewRepository: jest.Mocked<IReviewRepository>;

  beforeEach(() => {
    mockReviewRepository = {
      findById: jest.fn(),
      findByCreatorId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      favorite: jest.fn(),
      unfavorite: jest.fn(),
      isFavorited: jest.fn(),
    };

    useCase = new GetReviewUseCase(mockReviewRepository);
  });

  it('should throw NotFoundException if review does not exist', async () => {
    mockReviewRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('non-existent-id', 'user-123'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is not the review creator', async () => {
    const mockReview = Review.create('rev-1', 'Title', 'owner-user-id', []);
    mockReviewRepository.findById.mockResolvedValue(mockReview);

    await expect(useCase.execute('rev-1', 'other-user-id')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should return review and isFavorited state for owner', async () => {
    const mockReview = Review.create('rev-1', 'Title', 'user-123', []);
    mockReviewRepository.findById.mockResolvedValue(mockReview);
    mockReviewRepository.isFavorited.mockResolvedValue(true);

    const result = await useCase.execute('rev-1', 'user-123');

    expect(result.review).toBe(mockReview);
    expect(result.isFavorited).toBe(true);
  });
});
