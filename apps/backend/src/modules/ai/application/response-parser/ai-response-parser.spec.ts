/// <reference types="jest" />

import { AIResponseParser } from './ai-response-parser';
import { Severity } from '../../../review/domain/severity.enum';

describe('AIResponseParser', () => {
  let parser: AIResponseParser;

  beforeEach(() => {
    parser = new AIResponseParser();
  });

  it('should parse valid JSON output correctly', () => {
    const rawJson = JSON.stringify({
      summary: 'Clean code',
      explanation: 'No issues found',
      bugs: [
        {
          filename: 'app.ts',
          line: 10,
          severity: 'CRITICAL',
          category: 'BUG',
          message: 'Syntax error',
        },
      ],
      qualityScore: 92,
    });

    const result = parser.parseAndNormalize(
      rawJson,
      'gemini',
      'gemini-1.5-pro',
      150,
    );

    expect(result.summary).toBe('Clean code');
    expect(result.qualityScore).toBe(92);
    expect(result.bugs).toHaveLength(1);
    expect(result.bugs[0].severity).toBe(Severity.CRITICAL);
  });

  it('should strip markdown backticks correctly', () => {
    const rawText = `
Here is the JSON report:
\`\`\`json
{
  "summary": "Parsed from markdown",
  "qualityScore": 88
}
\`\`\`
`;

    const result = parser.parseAndNormalize(rawText, 'openai', 'gpt-4o', 200);

    expect(result.summary).toBe('Parsed from markdown');
    expect(result.qualityScore).toBe(88);
  });

  it('should fallback gracefully when JSON parsing fails', () => {
    const rawText = 'Invalid unstructured string without valid JSON payload';

    const result = parser.parseAndNormalize(
      rawText,
      'ollama',
      'codellama',
      180,
    );

    expect(result.summary).toBe(
      'AI Analysis completed with unstructured output.',
    );
    expect(result.qualityScore).toBe(80);
    expect(result.rawResponse).toBe(rawText);
  });
});
