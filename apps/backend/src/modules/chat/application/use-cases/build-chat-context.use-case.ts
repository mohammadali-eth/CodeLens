import { Inject, Injectable, Logger } from '@nestjs/common';
import { IReviewRepository } from '../../../review/application/ports/review-repository.interface';
import { ChatSession } from '../../domain/chat-session.entity';
import { AISanitizerService } from '../../../ai/infrastructure/sanitizer/ai-sanitizer.service';
import { MessageRole } from '../../domain/message-role.enum';

export interface CompiledChatContext {
  systemPrompt: string;
  userPrompt: string;
  filesCount: number;
}

@Injectable()
export class BuildChatContextUseCase {
  private readonly logger = new Logger(BuildChatContextUseCase.name);

  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    private readonly sanitizerService: AISanitizerService,
  ) {}

  async execute(
    session: ChatSession,
    currentPrompt: string,
  ): Promise<CompiledChatContext> {
    this.logger.log(
      `Building chat context for session ID ${session.id} (ReviewId: ${session.reviewId || 'none'})`,
    );

    const sanitizedPrompt = this.sanitizerService.sanitize(currentPrompt);
    let contextHeader = '';
    let filesCount = 0;

    // 1. Fetch Review Code Snapshot & Static Findings if session is bound to a review
    if (session.reviewId) {
      const review = await this.reviewRepository.findById(session.reviewId);
      if (review) {
        filesCount = review.files.length;
        const codeFilesSummary = review.files
          .map(
            (f) => `--- FILE: ${f.filename} (${f.language}) ---
Original Content:
${f.content}
${f.improvedCode ? `AI Refactored Code:\n${f.improvedCode}` : ''}
Issues (${f.issues.length}):
${f.issues.map((i) => ` - [${i.severity}] Line ${i.line} (${i.category}): ${i.message}`).join('\n')}
`,
          )
          .join('\n\n');

        contextHeader = `
=== CODE REVIEW CONTEXT ===
Review Title: ${review.title}
Quality Score: ${review.score ?? 'N/A'}/100
Time Complexity: ${review.timeComplexity ?? 'N/A'}
Space Complexity: ${review.spaceComplexity ?? 'N/A'}
Structural Summary: ${review.summary ?? 'None'}

SUBMITTED CODE FILES & FINDINGS:
${codeFilesSummary}
=== END CONTEXT ===
`;
      }
    }

    // 2. Sliding Conversation History Memory Window (Recent 10 messages)
    const recentMessages = session.messages
      .filter((m) => m.role !== MessageRole.SYSTEM)
      .slice(-10);

    const conversationHistoryStr = recentMessages
      .map(
        (m) =>
          `${m.role === MessageRole.USER ? 'User' : 'Assistant'}: ${m.content}`,
      )
      .join('\n');

    // 3. System Instruction & Prompt Assembly
    const systemPrompt = `You are CodeLens AI Assistant, a Principal Software Architect and Senior Code Reviewer.
Your goal is to answer developer questions about their code reviews, specific files, bugs, optimizations, and refactoring techniques.

GUIDELINES:
- Provide clear, expert, and actionable explanations.
- When generating code, use Markdown code blocks with syntax highlighting language identifiers.
- Reference exact line numbers and filenames when discussing bugs or suggestions.
- Be concise, accurate, and professional. Never output non-code text inside code blocks.

${contextHeader}
`;

    const userPrompt = `${conversationHistoryStr ? `CONVERSATION HISTORY:\n${conversationHistoryStr}\n\n` : ''}CURRENT USER PROMPT: ${sanitizedPrompt}`;

    return {
      systemPrompt,
      userPrompt,
      filesCount,
    };
  }
}
