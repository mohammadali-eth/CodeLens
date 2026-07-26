import { ReportTemplateType } from './report-template-type.enum';

export interface ITemplateConfig {
  includeCodeSnippets: boolean;
  includeIssueDetails: boolean;
  includeComplexityAnalysis: boolean;
  includeBestPractices: boolean;
  includeExecutiveSummary: boolean;
  maxIssuesLimit?: number;
  primaryColor?: string;
  logoUrl?: string;
}

export class ReportTemplateEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: ReportTemplateType,
    public readonly description: string,
    public readonly config: ITemplateConfig,
    public readonly isDefault: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
