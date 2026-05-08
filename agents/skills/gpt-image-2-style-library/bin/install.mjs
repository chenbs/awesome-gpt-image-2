#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const skillName = 'gpt-image-2-style-library';
const command = process.argv[2] || 'install';
const allowedCommands = new Set(['install', 'sync']);

if (!allowedCommands.has(command)) {
  console.error(`Usage: gpt-image-2-style-library install`);
  process.exit(1);
}

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const codexHome = process.env.CODEX_HOME || join(homedir(), '.codex');
const targetRoot = join(codexHome, 'skills');
const target = join(targetRoot, skillName);
const entries = ['SKILL.md', 'agents', 'references'];

for (const entry of entries) {
  const source = join(packageRoot, entry);
  if (!existsSync(source)) {
    throw new Error(`Missing package entry: ${entry}`);
  }
}

mkdirSync(targetRoot, { recursive: true });
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

for (const entry of entries) {
  cpSync(join(packageRoot, entry), join(target, entry), { recursive: true });
}

console.log(`Installed ${skillName} to ${target}`);
