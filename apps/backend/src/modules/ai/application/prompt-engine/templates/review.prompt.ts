import { CodeFilePayload } from '../../../domain/ai-engine-service.interface';

export function buildReviewPromptV1(files: CodeFilePayload[]): string {
  const formattedFiles = files
    .map(
      (file) => `
<file name="${file.filename}" language="${file.language || 'auto'}">
<![CDATA[
${file.content}
]]>
</file>
`,
    )
    .join('\n');

  return `
Target Source Code Files for Deep Inspection (${files.length} file(s)):
${formattedFiles}

INSTRUCTIONS:
Examine every line of code above against safety, efficiency, and maintenance standards. Return strictly the target JSON payload.
`;
}
