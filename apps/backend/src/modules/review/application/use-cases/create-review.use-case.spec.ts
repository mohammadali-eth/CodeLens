/// <reference types="jest" />
/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException } from '@nestjs/common';
import { CreateReviewUseCase } from './create-review.use-case';
import { IReviewRepository } from '../ports/review-repository.interface';
import { Review } from '../../domain/review.entity';

describe('CreateReviewUseCase', () => {
  let useCase: CreateReviewUseCase;
  let mockReviewRepository: jest.Mocked<IReviewRepository>;

  beforeEach(() => {
    mockReviewRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByCreatorId: jest.fn(),
      save: jest
        .fn<Promise<Review>, [Review]>()
        .mockImplementation((review: Review) => Promise.resolve(review)),
      update: jest.fn(),
      delete: jest.fn(),
      favorite: jest.fn(),
      unfavorite: jest.fn(),
      isFavorited: jest.fn(),
    };

    useCase = new CreateReviewUseCase(mockReviewRepository);
  });

  it('should throw BadRequestException if files list is empty', async () => {
    await expect(
      useCase.execute({ title: 'Test Review', files: [] }, 'user-123'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should successfully construct and save a Review aggregate', async () => {
    const dto = {
      title: 'Fix Concurrent Access Bug',
      repository: 'mohammadali-eth/CodeLens',
      branch: 'main',
      files: [
        {
          filename: 'UserService.java',
          content: 'public class UserService { public void save() {} }',
          language: 'JAVA',
        },
      ],
    };

    const result = await useCase.execute(dto, 'user-123');

    expect(result).toBeDefined();
    expect(result.title).toBe('Fix Concurrent Access Bug');
    expect(result.creatorId).toBe('user-123');
    expect(result.files.length).toBe(1);
    expect(result.files[0].filename).toBe('UserService.java');
    expect(result.files[0].language).toBe('JAVA');
    expect(mockReviewRepository.save).toHaveBeenCalled();
  });
});
