import {
  detectLanguage,
  getLanguageDisplayName,
  getLanguageSymbol,
} from './language-detector';

describe('Language Detector Utility', () => {
  it('Scenario 50 (Regression Bug Fix): index.html MUST detect as "html"', () => {
    expect(detectLanguage('index.html')).toBe('html');
    expect(detectLanguage('src/index.html')).toBe('html');
    expect(detectLanguage('page.htm')).toBe('html');
    expect(getLanguageDisplayName('index.html')).toBe('HTML');
  });

  it('must correctly detect web languages', () => {
    expect(detectLanguage('styles.css')).toBe('css');
    expect(detectLanguage('styles.scss')).toBe('scss');
    expect(detectLanguage('styles.less')).toBe('less');
    expect(detectLanguage('app.js')).toBe('javascript');
    expect(detectLanguage('Component.jsx')).toBe('javascript');
    expect(getLanguageDisplayName('Component.jsx')).toBe('JSX');
    expect(detectLanguage('app.ts')).toBe('typescript');
    expect(detectLanguage('App.tsx')).toBe('typescript');
    expect(getLanguageDisplayName('App.tsx')).toBe('TSX');
  });

  it('must correctly detect backend & system languages', () => {
    expect(detectLanguage('package.json')).toBe('json');
    expect(detectLanguage('script.py')).toBe('python');
    expect(detectLanguage('Main.java')).toBe('java');
    expect(detectLanguage('main.go')).toBe('go');
    expect(detectLanguage('main.rs')).toBe('rust');
    expect(detectLanguage('main.cpp')).toBe('cpp');
    expect(detectLanguage('main.c')).toBe('c');
    expect(detectLanguage('Program.cs')).toBe('csharp');
    expect(detectLanguage('index.php')).toBe('php');
    expect(detectLanguage('script.sh')).toBe('shell');
    expect(detectLanguage('query.sql')).toBe('sql');
    expect(detectLanguage('README.md')).toBe('markdown');
    expect(detectLanguage('Dockerfile')).toBe('dockerfile');
  });

  it('must fallback to plaintext for unknown extensions without throwing errors', () => {
    expect(detectLanguage('unknown.xyz')).toBe('plaintext');
    expect(getLanguageDisplayName('unknown.xyz')).toBe('XYZ');
  });

  it('must support content-based fallback detection when extension is missing', () => {
    const htmlSnippet = '<!DOCTYPE html><html><head></head><body></body></html>';
    expect(detectLanguage('fileWithoutExtension', htmlSnippet)).toBe('html');

    const jsonSnippet = '{\n  "key": "value"\n}';
    expect(detectLanguage('fileWithoutExtension', jsonSnippet)).toBe('json');
  });

  it('must prioritize explicit file extension over content fallback', () => {
    const htmlInTs = 'const htmlTemplate = `<!DOCTYPE html><html></html>`;';
    expect(detectLanguage('template.ts', htmlInTs)).toBe('typescript');
  });
});
