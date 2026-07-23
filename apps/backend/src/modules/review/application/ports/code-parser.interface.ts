export interface ParsedCodeMetadata {
  language: string;
  linesOfCode: number;
}

export interface ICodeParserService {
  parse(filename: string, content: string): ParsedCodeMetadata;
}

export const ICodeParserService = Symbol('ICodeParserService');
