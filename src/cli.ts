#!/usr/bin/env node
import * as prog from 'caporal';
import { exportMarkdown } from './engine';

const version = require('../package.json').version;

prog
  .version(version)
  .name('mume')
  // HTML
  .command('html', 'renders markdown to html')
  .argument('[input...]', 'markdown path or glob pattern')
  .option('-o, --out <outdir>', 'output path')
  .action(async (args, options, logger) => {
    return exportMarkdown('html', args, options, logger);
  })
  // GFM
  .command('gfm', 'renders to Github flavored markdown')
  .argument('[input...]', 'markdown path or glob pattern')
  .option('-o, --out <outdir>', 'output path')
  .action(async (args, options, logger) => {
    return exportMarkdown('gmf', args, options, logger);
  })
  // pandoc
  .command('pandoc', 'convert markdown using pandoc')
  .help('requires pandoc to be installed globally')
  .argument('[input...]', 'markdown path or glob pattern')
  .option('-o, --out <outdir>', 'output path')
  .action(async (args, options, logger) => {
    return exportMarkdown('pandoc', args, options, logger);
  })
  // PDF
  .command('pdf', 'renders markdown  to pdf')
  .help('requires puppeteer to be installed globally')
  .argument('[input...]', 'markdown path or glob pattern')
  .option('-o, --out <outdir>', 'output path')
  .action(async (args, options, logger) => {
    return exportMarkdown('pdf', args, options, logger);
  })
  // ebook
  .command('ebook', 'renders to ebook')
  .help('requires calibre to be installed globally')
  .argument('<format>', 'output file type (epub/mobi/pdf/html)', [
    'epub',
    'mobi',
    'pdf',
    'html'
  ])
  .argument('[input...]', 'markdown path or glob pattern')
  .action(async (args, options, logger) => {
    return exportMarkdown('ebook', args, options, logger);
  });

// run
async function run() {
  await prog.parse(process.argv);
  process.exit();
}

run();
