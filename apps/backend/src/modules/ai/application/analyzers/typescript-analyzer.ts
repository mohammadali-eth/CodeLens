import { Injectable, Logger } from '@nestjs/common';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { CodeFilePayload } from '../../domain/ai-engine-service.interface';
import { CodeIssuePayload } from '../../domain/unified-ai-response.interface';
import { Severity } from '../../../review/domain/severity.enum';

export interface StaticAnalysisResult {
  findings: CodeIssuePayload[];
  hasCompilerErrors: boolean;
}

@Injectable()
export class TypeScriptAnalyzer {
  private readonly logger = new Logger(TypeScriptAnalyzer.name);
  private installedPackagesCache: Set<string> | null = null;

  /**
   * Performs deterministic AST and module resolution analysis on submitted code files.
   */
  analyze(files: CodeFilePayload[]): StaticAnalysisResult {
    const findings: CodeIssuePayload[] = [];
    let hasCompilerErrors = false;

    const packageNames = this.getProjectInstalledPackages();

    for (const file of files) {
      const lang = (file.language || '').toUpperCase();
      if (
        lang !== 'TYPESCRIPT' &&
        lang !== 'JAVASCRIPT' &&
        !file.filename.endsWith('.ts') &&
        !file.filename.endsWith('.tsx') &&
        !file.filename.endsWith('.js') &&
        !file.filename.endsWith('.jsx')
      ) {
        continue;
      }

      // 1. AST Parsing Diagnostic Check
      const sourceFile = ts.createSourceFile(
        file.filename,
        file.content,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );

      // Check AST parse diagnostics (syntax errors)
      const parseDiagnostics = (sourceFile as any).parseDiagnostics;
      if (parseDiagnostics && parseDiagnostics.length > 0) {
        for (const diag of parseDiagnostics) {
          hasCompilerErrors = true;
          const pos = sourceFile.getLineAndCharacterOfPosition(diag.start || 0);
          findings.push({
            filename: file.filename,
            line: pos.line + 1,
            severity: Severity.HIGH,
            category: 'CORRECTNESS',
            message: `SyntaxError: ${ts.flattenDiagnosticMessageText(diag.messageText, '\n')}`,
            suggestion: 'Fix syntax error to enable clean TypeScript compilation.',
            confidenceScore: 1.0,
          });
        }
      }

      // 2. AST Visitor Inspection
      const visit = (node: ts.Node) => {
        // Inspect Import Declarations for unresolved dependencies
        if (ts.isImportDeclaration(node)) {
          const moduleSpecifier = node.moduleSpecifier;
          if (ts.isStringLiteral(moduleSpecifier)) {
            const moduleName = moduleSpecifier.text;
            if (!moduleName.startsWith('.') && !moduleName.startsWith('/')) {
              // External package import (e.g. '@angular/core')
              const basePackage = moduleName.startsWith('@')
                ? moduleName.split('/').slice(0, 2).join('/')
                : moduleName.split('/')[0];

              if (!packageNames.has(basePackage)) {
                hasCompilerErrors = true;
                const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
                findings.push({
                  filename: file.filename,
                  line: pos.line + 1,
                  severity: Severity.HIGH,
                  category: 'CORRECTNESS',
                  message: `Unresolved Dependency / Invalid Import: Module '${moduleName}' cannot be resolved in project context.`,
                  suggestion: `Verify package.json dependencies or replace '${moduleName}' with configured framework libraries.`,
                  confidenceScore: 0.98,
                });
              }
            }
          }
        }

        // Inspect Variable Statements for 'any' types
        if (ts.isVariableDeclaration(node) && node.type) {
          if (node.type.kind === ts.SyntaxKind.AnyKeyword) {
            const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            findings.push({
              filename: file.filename,
              line: pos.line + 1,
              severity: Severity.LOW,
              category: 'BEST_PRACTICE',
              message: `Explicit 'any' type annotation on variable '${node.name.getText(sourceFile)}' disables static type checking.`,
              suggestion: `Replace 'any' with a specific interface, generic type, or 'unknown'.`,
              confidenceScore: 0.95,
            });
          }
        }

        // Inspect Type Assertions with 'any'
        if (ts.isAsExpression(node) && node.type.kind === ts.SyntaxKind.AnyKeyword) {
          const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          findings.push({
            filename: file.filename,
            line: pos.line + 1,
            severity: Severity.LOW,
            category: 'BEST_PRACTICE',
            message: `Unsafe type assertion to 'any' bypasses compiler type safety checks.`,
            suggestion: `Avoid casting expressions to 'any'.`,
            confidenceScore: 0.92,
          });
        }

        // Inspect Unhandled Promises (e.g. calling async function without await inside async method)
        if (ts.isCallExpression(node)) {
          const fnText = node.expression.getText(sourceFile);
          if (fnText === 'fetch' && !this.isAwaitedOrReturned(node)) {
            const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            findings.push({
              filename: file.filename,
              line: pos.line + 1,
              severity: Severity.MEDIUM,
              category: 'RELIABILITY',
              message: `Floating Promise: 'fetch()' call is missing 'await' or return statement, which may cause silent async execution failures.`,
              suggestion: `Add 'await' before 'fetch()' or return the promise chain.`,
              confidenceScore: 0.90,
            });
          }
        }

        ts.forEachChild(node, visit);
      };

      visit(sourceFile);
    }

    return { findings, hasCompilerErrors };
  }

  private isAwaitedOrReturned(node: ts.Node): boolean {
    let parent = node.parent;
    while (parent) {
      if (ts.isAwaitExpression(parent) || ts.isReturnStatement(parent)) {
        return true;
      }
      if (ts.isBlock(parent) || ts.isExpressionStatement(parent)) {
        break;
      }
      parent = parent.parent;
    }
    return false;
  }

  private getProjectInstalledPackages(): Set<string> {
    if (this.installedPackagesCache) {
      return this.installedPackagesCache;
    }

    const packages = new Set<string>([
      'rxjs',
      'typescript',
      'express',
      'dotenv',
      'lodash',
      'axios',
      'crypto',
      'fs',
      'path',
      'util',
      'events',
      'http',
      'https',
      'os',
    ]);

    try {
      const rootPkgPath = path.resolve(process.cwd(), 'package.json');
      if (fs.existsSync(rootPkgPath)) {
        const pkgContent = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
        const deps = {
          ...(pkgContent.dependencies || {}),
          ...(pkgContent.devDependencies || {}),
        };
        Object.keys(deps).forEach((dep) => packages.add(dep));
      }

      // Check monorepo apps package.json if present
      const appsDir = path.resolve(process.cwd(), 'apps');
      if (fs.existsSync(appsDir)) {
        const subDirs = fs.readdirSync(appsDir);
        for (const subDir of subDirs) {
          const subPkgPath = path.join(appsDir, subDir, 'package.json');
          if (fs.existsSync(subPkgPath)) {
            const subPkg = JSON.parse(fs.readFileSync(subPkgPath, 'utf8'));
            const subDeps = {
              ...(subPkg.dependencies || {}),
              ...(subPkg.devDependencies || {}),
            };
            Object.keys(subDeps).forEach((dep) => packages.add(dep));
          }
        }
      }
    } catch (e) {
      this.logger.warn('Failed to parse workspace package.json files for dependency validation.');
    }

    this.installedPackagesCache = packages;
    return packages;
  }
}
