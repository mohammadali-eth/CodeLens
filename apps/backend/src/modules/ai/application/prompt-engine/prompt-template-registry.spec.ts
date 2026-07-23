/// <reference types="jest" />

import { PromptTemplateRegistry } from './prompt-template-registry';

describe('PromptTemplateRegistry', () => {
  let registry: PromptTemplateRegistry;

  beforeEach(() => {
    registry = new PromptTemplateRegistry();
  });

  it('should compile review prompt with system prompt and language rules', () => {
    const files = [
      {
        filename: 'service.ts',
        content: 'export class Service {}',
        language: 'TYPESCRIPT',
      },
    ];

    const prompt = registry.compileReviewPrompt(files);

    expect(prompt.version).toBe('v1.0');
    expect(prompt.systemPrompt).toContain('You are CodeLens AI');
    expect(prompt.systemPrompt).toContain('TYPESCRIPT');
    expect(prompt.userPrompt).toContain('service.ts');
  });
});
