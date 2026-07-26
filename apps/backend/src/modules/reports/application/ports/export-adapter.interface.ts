import { ReportFormat } from '../../domain/report-format.enum';
import { IReportContent } from '../../domain/report-content.interface';

export const EXPORT_ADAPTER = Symbol('EXPORT_ADAPTER');

export interface ExportResult {
  format: ReportFormat;
  mimeType: string;
  filename: string;
  buffer: Buffer;
  contentString?: string;
}

export interface IExportAdapter {
  readonly format: ReportFormat;
  export(content: IReportContent): Promise<ExportResult>;
}
