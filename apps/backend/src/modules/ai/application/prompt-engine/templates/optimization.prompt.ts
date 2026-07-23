export const OPTIMIZATION_INSTRUCTION_V1 = `
PERFORMANCE & COMPLEXITY FOCUS:
1. Identify any O(N^2) or worse nested loops that can be optimized to O(N) or O(N log N) using Hash Maps or dynamic programming.
2. Highlight unnecessary allocations or redundant DB/Network roundtrips.
3. Suggest async parallelization (Promise.all) where sequential execution blocks IO.
`;
