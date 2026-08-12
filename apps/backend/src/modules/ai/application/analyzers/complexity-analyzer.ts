import { Injectable, Logger } from '@nestjs/common';
import * as ts from 'typescript';
import { CodeFilePayload } from '../../domain/ai-engine-service.interface';

export interface ComplexityAnalysisResult {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}

@Injectable()
export class ComplexityAnalyzer {
  private readonly logger = new Logger(ComplexityAnalyzer.name);

  analyze(files: CodeFilePayload[]): ComplexityAnalysisResult {
    let maxLoopDepth = 0;
    let hasRecursion = false;
    let hasSorting = false;
    let hasBinarySearch = false;
    let createsLargeAllocations = false;

    for (const file of files) {
      if (
        !file.filename.endsWith('.ts') &&
        !file.filename.endsWith('.tsx') &&
        !file.filename.endsWith('.js') &&
        !file.filename.endsWith('.jsx')
      ) {
        continue;
      }

      const sourceFile = ts.createSourceFile(
        file.filename,
        file.content,
        ts.ScriptTarget.Latest,
        true,
      );

      const inspectNode = (node: ts.Node, currentDepth: number) => {
        let nextDepth = currentDepth;

        // Check for loops
        if (
          ts.isForStatement(node) ||
          ts.isForInStatement(node) ||
          ts.isForOfStatement(node) ||
          ts.isWhileStatement(node) ||
          ts.isDoStatement(node)
        ) {
          nextDepth = currentDepth + 1;
          if (nextDepth > maxLoopDepth) {
            maxLoopDepth = nextDepth;
          }
        }

        // Check array allocation inside loops or heavy structures
        if (ts.isArrayLiteralExpression(node) || ts.isNewExpression(node)) {
          if (currentDepth > 0) {
            createsLargeAllocations = true;
          }
        }

        // Check method calls (sort, binarySearch, etc.)
        if (ts.isCallExpression(node)) {
          const fnName = node.expression.getText(sourceFile);
          if (fnName.endsWith('.sort')) {
            hasSorting = true;
          }
          if (
            fnName.toLowerCase().includes('binarysearch') ||
            fnName.toLowerCase().includes('bsearch')
          ) {
            hasBinarySearch = true;
          }
        }

        ts.forEachChild(node, (child) => inspectNode(child, nextDepth));
      };

      inspectNode(sourceFile, 0);
    }

    // Determine Time Complexity
    let timeComplexity = 'O(1)';
    let explanationParts: string[] = [];

    if (hasSorting) {
      timeComplexity = 'O(N log N)';
      explanationParts.push('Sorting operations detected (O(N log N))');
    } else if (hasBinarySearch) {
      timeComplexity = 'O(log N)';
      explanationParts.push('Logarithmic search pattern detected (O(log N))');
    } else if (maxLoopDepth === 1) {
      timeComplexity = 'O(N)';
      explanationParts.push('Single linear control loop detected (O(N))');
    } else if (maxLoopDepth === 2) {
      timeComplexity = 'O(N²)';
      explanationParts.push('Nested loop structure detected (O(N²))');
    } else if (maxLoopDepth >= 3) {
      timeComplexity = `O(N^${maxLoopDepth})`;
      explanationParts.push(`Deeply nested loops detected (${maxLoopDepth} levels: O(N^${maxLoopDepth}))`);
    } else {
      timeComplexity = 'O(1)';
      explanationParts.push('Scalar operations with constant time execution (O(1))');
    }

    // Determine Space Complexity
    let spaceComplexity = 'O(1)';
    if (createsLargeAllocations || maxLoopDepth > 1) {
      spaceComplexity = 'O(N)';
      explanationParts.push('Dynamic collection allocations proportional to input size (O(N))');
    } else {
      spaceComplexity = 'O(1)';
      explanationParts.push('Constant auxiliary memory usage (O(1))');
    }

    return {
      timeComplexity,
      spaceComplexity,
      explanation: explanationParts.join('. ') + '.',
    };
  }
}
