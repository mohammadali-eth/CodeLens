/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/// <reference types="jest" />

import { BuildChatContextUseCase } from './build-chat-context.use-case';
import { IReviewRepository } from '../../../review/application/ports/review-repository.interface';
import { AISanitizerService } from '../../../ai/infrastructure/sanitizer/ai-sanitizer.service';
import { ChatSession } from '../../domain/chat-session.entity';

describe('BuildChatContextUseCase', () => {
  let useCase: BuildChatContextUseCase;
  let reviewRepositoryMock: jest.Mocked<IReviewRepository>;
  let sanitizerServiceMock: jest.Mocked<AISanitizerService>;

  beforeEach(() => {
    reviewRepositoryMock = {
      findById: jest.fn().mockResolvedValue({
        id: 'review-1',
        title: 'Auth Service Refactor',
        score: 85,
        summary: 'Clean architecture implementation',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        files: [
          {
            filename: 'auth.ts',
            language: 'TYPESCRIPT',
            content: 'const a = 1;',
            improvedCode: 'const a: number = 1;',
            issues: [
              {
                line: 1,
                severity: 'MEDIUM',
                category: 'STYLE',
                message: 'Add explicit type annotation',
              },
            ],
          },
        ],
      }),
    } as any;

    sanitizerServiceMock = {
      sanitize: jest.fn().mockImplementation((input: string) => input),
    } as any;

    useCase = new BuildChatContextUseCase(
      reviewRepositoryMock,
      sanitizerServiceMock,
    );
  });

  it('should compile context with review code files and static issues', async () => {
    const session = ChatSession.create(
      'session-1',
      'user-1',
      'Chat Title',
      'review-1',
    );
    const result = await useCase.execute(session, 'How do I fix line 1?');

    expect(result.filesCount).toBe(1);
    expect(result.systemPrompt).toContain('Auth Service Refactor');
    expect(result.systemPrompt).toContain('auth.ts');
    expect(result.userPrompt).toContain('How do I fix line 1?');
  });
});
