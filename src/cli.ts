#!/usr/bin/env node
import * as prog from 'caporal';
import { exportMarkdown } from './engine';

const version = require('../package.json').version;

prog
  .version(version)
  .name('mume')
  // PDF
  .command('pdf', 'renders markdown  to pdf')
  .argument('<markdown...>', 'markdown path or glob pattern')
  .option('-o, --out <outdir>', 'output path')
  .action(async (args, options, logger) => {
    return exportMarkdown('pdf', args, options, logger);
  })
  .command('html', 'renders markdown to html')
  .argument('<markdown...>', 'markdown path or glob pattern')
  .option('-o, --out <outdir>', 'output path')
  .action(async (args, options, logger) => {
    return exportMarkdown('html', args, options, logger);
  })
  .command('gfm', 'renders to Github flavored markdown')
  .argument('<markdown...>', 'markdown path or glob pattern')
  .option('-o, --out <outdir>', 'output path')
  .action(async (args, options, logger) => {
    return exportMarkdown('gmf', args, options, logger);
  });


// run
async function run() {
  await prog.parse(process.argv);
  process.exit();
}

run();
