import * as globby from 'globby';
import * as fs from 'fs-extra';
import * as path from 'path';

import { MarkdownEngine, MarkdownEngineConfig, init } from '@shd101wyy/mume';

export { MarkdownEngine, MarkdownEngineConfig };

export const config: MarkdownEngineConfig = {
  usePandocParser: false,
  breakOnSingleNewLine: true,
  enableTypographer: false,
  enableWikiLinkSyntax: true,
  enableEmojiSyntax: true,
  enableExtendedTableSyntax: false,
  enableCriticMarkupSyntax: false,
  wikiLinkFileExtension: '.md',
  protocolsWhiteList: 'http://, https://, atom://, file://, mailto:, tel:',
  mathRenderingOption: 'KaTeX',
  mathInlineDelimiters: [['$', '$'], ['\\(', '\\)']],
  mathBlockDelimiters: [['$$', '$$'], ['\\[', '\\]']],
  codeBlockTheme: 'auto.css',
  previewTheme: 'github-light.css',
  revealjsTheme: 'white.css',
  mermaidTheme: 'mermaid.css',
  frontMatterRenderingOption: 'none',
  imageFolderPath: '/assets',
  printBackground: false,
  phantomPath: 'phantomjs',
  pandocPath: 'pandoc',
  pandocMarkdownFlavor: 'markdown-raw_tex+tex_math_single_backslash',
  pandocArguments: [],
  latexEngine: 'pdflatex',
  enableScriptExecution: false
};

export async function createEngine(
  filePath: string,
  projectDirectoryPath?: string
): Promise<MarkdownEngine> {
  await init();
  return new MarkdownEngine({
    filePath,
    projectDirectoryPath,
    config
  });
}

export async function exportHtml(
  filePath: string,
  options: {
    projectDirectoryPath?: string;
    offline?: boolean;
    runAllCodeChunks?: boolean;
  } = {}
) {
  const { projectDirectoryPath, offline, runAllCodeChunks } = options;
  const engine = await createEngine(filePath, projectDirectoryPath);
  return engine.htmlExport({
    offline,
    runAllCodeChunks
  });
}

export async function exportPdf(
  filePath: string,
  options: {
    projectDirectoryPath?: string;
    runAllCodeChunks?: boolean;
    openFileAfterGeneration?: boolean;
  } = {}
) {
  const {
    projectDirectoryPath,
    runAllCodeChunks,
    openFileAfterGeneration
  } = options;
  const engine = await createEngine(filePath, projectDirectoryPath);
  return engine.chromeExport({
    fileType: 'pdf',
    runAllCodeChunks,
    openFileAfterGeneration
  });
}

export async function exportGfm(
  filePath: string,
  options: {
    projectDirectoryPath?: string;
    runAllCodeChunks?: boolean;
  } = {}
) {
  const { projectDirectoryPath, runAllCodeChunks } = options;
  const engine = await createEngine(filePath, projectDirectoryPath);
  return engine.markdownExport({
    runAllCodeChunks
  });
}

export async function exportEbook(
  filePath: string,
  fileType: string,
) {
  const engine = await createEngine(filePath);
  return engine.eBookExport({
    fileType
  });
}

export async function exportMarkdown(
  type: 'pdf' | 'gmf' | 'html' | 'ebook',
  args,
  options,
  logger
) {
  let render;
  switch (type) {
    case 'pdf':
      render = exportPdf;
      break;
    case 'html':
      render = exportHtml;
      break;
    case 'gmf':
      render = exportGfm;
      break;
    case 'ebook':
      await exportEbook(args.input, args.format);
      return;
    default:
      throw Error(`unknown format ${type}`);
  }

  const files = [];
  for (const pattern of args.markdown) {
    const paths = await globby([pattern]);
    paths.forEach(p => files.push(p));
  }

  options.out && files.length && (await fs.mkdirp(options.out));
  for (const md of files) {
    logger.info(`rendering ${md}`);
    const output = await render(md);
    options.out && (await fs.move(output, path.join(options.out, output)));
  }
}
