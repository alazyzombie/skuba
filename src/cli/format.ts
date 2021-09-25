import chalk from 'chalk';

import { hasDebugFlag } from '../utils/args';
import { createLogger, log } from '../utils/logging';

import { runESLint } from './adapter/eslint';
import { runPrettier } from './adapter/prettier';

export const format = async (args = process.argv) => {
  const debug = hasDebugFlag(args);

  log.newline();
  log.plain(chalk.magenta('Fixing code with ESLint'));
  log.plain(chalk.magenta('-----------------------'));

  const eslint = await runESLint('format', createLogger(debug));

  log.newline();
  log.plain(chalk.cyan('Formatting code with Prettier'));
  log.plain(chalk.cyan('-----------------------------'));

  const prettier = await runPrettier('format', createLogger(debug));

  log.newline();

  if (eslint.ok && prettier.ok) {
    return;
  }

  const tools = [
    ...(eslint.ok ? [] : ['ESLint']),
    ...(prettier.ok ? [] : ['Prettier']),
  ];

  log.err(tools.join(', '), 'found issues that require triage.');
  log.newline();

  process.exitCode = 1;
};
