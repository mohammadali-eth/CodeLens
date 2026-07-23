import { Injectable } from '@nestjs/common';
import { ICodeParserService, ParsedCodeMetadata } from '../../application/ports/code-parser.interface';

@Injectable()
export class SimpleCodeParserService implements ICodeParserService {
  private readonly extensionToLanguageMap: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    py: 'python',
    java: 'java',
    go: 'go',
    rs: 'rust',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    html: 'html',
    css: 'css',
    json: 'json',
    sql: 'sql',
    yml: 'yaml',
    yaml: 'yaml',
  };

  parse(filename: string, content: string): ParsedCodeMetadata {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const language = this.extensionToLanguageMap[ext] || 'plaintext';
    const linesOfCode = content ? content.split('\n').length : 0;

    return {
      language,
      linesOfCode,
    };
  }
}
