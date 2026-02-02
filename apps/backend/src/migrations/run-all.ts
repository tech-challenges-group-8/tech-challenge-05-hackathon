import { readdir } from 'fs/promises';
import path from 'path';

async function run(): Promise<void> {
  const migrationsDir = __dirname;
  const entries = await readdir(migrationsDir);

  const migrationFiles = entries
    .filter((file) =>
      file.endsWith('.ts') &&
      file !== 'run-all.ts' &&
      !file.startsWith('._')
    )
    .sort();

  for (const file of migrationFiles) {
    const fullPath = path.join(migrationsDir, file);
    await import(fullPath);
  }
}

run().catch((error) => {
  console.error('❌ Migration runner failed:', error);
  process.exit(1);
});
