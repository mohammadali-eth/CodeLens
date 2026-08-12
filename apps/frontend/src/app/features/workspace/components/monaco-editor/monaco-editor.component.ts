import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import loader from '@monaco-editor/loader';
import { detectLanguage } from '../../utils/language-detector';
import { LineNumbersOption } from '../../../settings/models/user-settings.interface';

export interface WorkspaceFileModel {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
}

@Component({
  selector: 'cdl-monaco-editor',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="monaco-wrapper">
      <div #editorContainer class="monaco-container"></div>
      <div class="editor-loading-overlay" *ngIf="isLoading">
        <span class="spinner-sm"></span>
        <span>Initializing CodeLens IDE Engine...</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
      }
      .monaco-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
      }
      .monaco-container {
        width: 100%;
        height: 100%;
      }
      .editor-loading-overlay {
        position: absolute;
        inset: 0;
        background: #0b0f19;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        color: #94a3b8;
        font-size: 0.875rem;
        z-index: 10;
      }
    `,
  ],
})
export class MonacoEditorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef<HTMLDivElement>;

  @Input() activeFile: WorkspaceFileModel | null = null;
  @Input() lineNumbers: LineNumbersOption = 'on';
  @Input() minimapEnabled = true;
  @Input() activeTargetLine: number | null = null;

  @Output() contentChange = new EventEmitter<string>();
  @Output() editorReady = new EventEmitter<any>();

  isLoading = true;
  private editor: any = null;
  private monaco: any = null;
  private modelMap = new Map<string, any>();
  private contentSubscription: any = null;
  private isSelfUpdating = false;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.initMonaco();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editor || !this.monaco) return;

    if (changes['activeFile'] && this.activeFile) {
      this.switchFileModel(this.activeFile);
    }

    if (changes['lineNumbers']) {
      this.editor.updateOptions({ lineNumbers: this.getMonacoLineNumbersOption(this.lineNumbers) });
    }

    if (changes['minimapEnabled']) {
      this.editor.updateOptions({ minimap: { enabled: this.minimapEnabled } });
    }

    if (changes['activeTargetLine'] && this.activeTargetLine) {
      this.revealLine(this.activeTargetLine);
    }
  }

  ngOnDestroy(): void {
    if (this.contentSubscription) {
      this.contentSubscription.dispose();
    }
    // Clean up models
    for (const model of this.modelMap.values()) {
      try {
        model.dispose();
      } catch {
        // Model disposed
      }
    }
    this.modelMap.clear();

    if (this.editor) {
      this.editor.dispose();
    }
  }

  private async initMonaco(): Promise<void> {
    try {
      this.monaco = await loader.init();
      this.defineTheme(this.monaco);

      this.zone.runOutsideAngular(() => {
        this.editor = this.monaco.editor.create(this.editorContainer.nativeElement, {
          theme: 'codlens-dark',
          automaticLayout: true,
          fontSize: 14,
          lineHeight: 22,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontLigatures: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          renderWhitespace: 'selection',
          wordWrap: 'off',
          padding: { top: 12, bottom: 12 },
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: true },
          tabSize: 2,
          insertSpaces: true,
          minimap: { enabled: this.minimapEnabled },
          lineNumbers: this.getMonacoLineNumbersOption(this.lineNumbers),
        });

        if (this.activeFile) {
          this.switchFileModel(this.activeFile);
        }

        this.zone.run(() => {
          this.isLoading = false;
          this.editorReady.emit(this.editor);
        });
      });
    } catch (err) {
      console.error('Failed to initialize Monaco Editor:', err);
      this.isLoading = false;
    }
  }

  private getMonacoLineNumbersOption(opt: LineNumbersOption): any {
    if (opt === 'off') return 'off';
    if (opt === 'relative') return 'relative';
    if (opt === 'interval') return (num: number) => (num % 5 === 0 || num === 1 ? String(num) : '');
    return 'on';
  }

  private switchFileModel(file: WorkspaceFileModel): void {
    if (!this.monaco || !this.editor) return;

    const detectedLang = detectLanguage(file.name, file.content);
    const uriString = `inmemory://workspace/${file.path || file.name}`;
    const uri = this.monaco.Uri.parse(uriString);

    let model = this.monaco.editor.getModel(uri);

    if (!model) {
      model = this.monaco.editor.createModel(file.content, detectedLang, uri);
      this.modelMap.set(uriString, model);
    } else {
      // Ensure model language is strictly updated to detected language
      if (model.getLanguageId() !== detectedLang) {
        this.monaco.editor.setModelLanguage(model, detectedLang);
      }
      // Sync content if changed externally and not actively editing
      if (!this.isSelfUpdating && model.getValue() !== file.content) {
        model.setValue(file.content);
      }
    }

    // Set active editor model
    this.editor.setModel(model);

    // Rebind content change listener
    if (this.contentSubscription) {
      this.contentSubscription.dispose();
    }

    this.contentSubscription = model.onDidChangeContent(() => {
      if (this.isSelfUpdating) return;

      const currentVal = model.getValue();
      this.zone.run(() => {
        this.isSelfUpdating = true;
        this.contentChange.emit(currentVal);
        this.isSelfUpdating = false;
      });
    });
  }

  public revealLine(lineNumber: number): void {
    if (!this.editor) return;
    this.editor.revealLineInCenter(lineNumber);
    this.editor.setPosition({ lineNumber, column: 1 });
    this.editor.focus();
  }

  public getCurrentValue(): string {
    if (!this.editor) return this.activeFile?.content || '';
    return this.editor.getValue();
  }

  public getModelValueForPath(path: string): string | null {
    if (!this.monaco) return null;
    const uriString = `inmemory://workspace/${path}`;
    const uri = this.monaco.Uri.parse(uriString);
    const model = this.monaco.editor.getModel(uri);
    return model ? model.getValue() : null;
  }

  private defineTheme(monaco: any): void {
    monaco.editor.defineTheme('codlens-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', background: '0b0f19', foreground: 'cbd5e1' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'keyword.html', foreground: 'f43f5e', fontStyle: 'bold' },
        { token: 'tag', foreground: 'f43f5e' },
        { token: 'tag.html', foreground: 'f43f5e' },
        { token: 'attribute.name', foreground: '38bdf8' },
        { token: 'attribute.name.html', foreground: '38bdf8' },
        { token: 'attribute.value', foreground: '34d399' },
        { token: 'attribute.value.html', foreground: '34d399' },
        { token: 'string', foreground: '34d399' },
        { token: 'string.html', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'comment.html', foreground: '64748b', fontStyle: 'italic' },
        { token: 'type', foreground: 'f472b6' },
        { token: 'function', foreground: '60a5fa' },
        { token: 'delimiter', foreground: '94a3b8' },
        { token: 'delimiter.html', foreground: '94a3b8' },
      ],
      colors: {
        'editor.background': '#0b0f19',
        'editor.foreground': '#cbd5e1',
        'editor.lineHighlightBackground': '#1e293b55',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#94a3b8',
        'editorIndentGuide.background': '#1e293b',
        'editorIndentGuide.activeBackground': '#334155',
        'editorCursor.foreground': '#38bdf8',
        'editor.selectionBackground': '#3b82f640',
        'editor.inactiveSelectionBackground': '#3b82f620',
      },
    });
  }
}
