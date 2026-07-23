import { Injectable } from '@nestjs/common';
import { CodeFilePayload } from '../../domain/ai-engine-service.interface';
import { SYSTEM_PROMPT_V1 } from './templates/system.prompt';
import { buildReviewPromptV1 } from './templates/review.prompt';
import { getLanguageGuideline } from './templates/language.prompt';
import { OPTIMIZATION_INSTRUCTION_V1 } from './templates/optimization.prompt';
import { EXPLANATION_INSTRUCTION_V1 } from './templates/explanation.prompt';

export interface CompiledPrompt {
  systemPrompt: string;
  userPrompt: string;
  version: string;
}

@Injectable()
export class PromptTemplateRegistry {
  public readonly defaultVersion = 'v1.0';

  compileReviewPrompt(files: CodeFilePayload[]): CompiledPrompt {
    const primaryLanguage = files.find((f) => f.language)?.language;
    const languageRules = getLanguageGuideline(primaryLanguage);

    const systemPrompt = [
      SYSTEM_PROMPT_V1,
      languageRules,
      OPTIMIZATION_INSTRUCTION_V1,
      EXPLANATION_INSTRUCTION_V1,
    ]
      .filter(Boolean)
      .join('\n\n');

    const userPrompt = buildReviewPromptV1(files);

    return {
      systemPrompt,
      userPrompt,
      version: this.defaultVersion,
    };
  }
}
