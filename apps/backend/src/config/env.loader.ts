import * as fs from 'fs';
import * as path from 'path';

export function loadEnv(): void {
  const envPaths = [
    path.resolve(process.cwd(), 'apps/backend/.env'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../../../.env'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        if (typeof (process as any).loadEnvFile === 'function') {
          (process as any).loadEnvFile(envPath);
        } else {
          const content = fs.readFileSync(envPath, 'utf8');
          for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
              const eqIdx = trimmed.indexOf('=');
              if (eqIdx > 0) {
                const key = trimmed.slice(0, eqIdx).trim();
                let val = trimmed.slice(eqIdx + 1).trim();
                if (
                  (val.startsWith('"') && val.endsWith('"')) ||
                  (val.startsWith("'") && val.endsWith("'"))
                ) {
                  val = val.slice(1, -1);
                }
                if (!process.env[key]) {
                  process.env[key] = val;
                }
              }
            }
          }
        }
      } catch {
        // Continue checking other paths
      }
    }
  }
}

// Automatically execute environment loading on import
loadEnv();
