/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/// <reference types="jest" />

import { GetSuggestedPromptsUseCase } from './get-suggested-prompts.use-case';
import { IReviewRepository } from '../../../review/application/ports/review-repository.interface';

describe('GetSuggestedPromptsUseCase', () => {
  let useCase: GetSuggestedPromptsUseCase;
  let reviewRepositoryMock: jest.Mocked<IReviewRepository>;

  beforeEach(() => {
    reviewRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: 'review-1',
        files: [
          {
            issues: [
              {
                line: 42,
                severity: 'CRITICAL',
                category: 'SECURITY',
                message: 'SQL Injection vulnerability',
              },
            ],
          },
        ],
      }),
    } as any;

    useCase = new GetSuggestedPromptsUseCase(reviewRepositoryMock);
  });

  it('should return default prompts when no review ID is provided', async () => {
    const prompts = await useCase.execute();
    expect(prompts.length).toBeGreaterThan(0);
    expect(prompts[0].category).toBe('EXPLANATION');
  });

  it('should prioritize critical fixes when review contains critical issues', async () => {
    const prompts = await useCase.execute('review-1');
    expect(prompts[0].category).toBe('CRITICAL_FIX');
    expect(prompts[0].promptText).toContain('SQL Injection vulnerability');
  });
});
