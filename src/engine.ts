import { init, MarkdownEngine, MarkdownEngineConfig } from '@shd101wyy/mume';
import * as fs from 'fs-extra';
import * as globby from 'globby';
import * as path from 'path';

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

export async function exportPandoc(
  filePath: string,
  options: {
    projectDirectoryPath?: string;
    runAllCodeChunks?: boolean;
  } = {}
) {
  const { projectDirectoryPath, runAllCodeChunks } = options;
  const engine = await createEngine(filePath, projectDirectoryPath);
  return engine.pandocExport({
    runAllCodeChunks
  });
}

export async function exportEbook(
  filePath: string,
  options: {
    fileType: string;
    runAllCodeChunks?: boolean;
  } = { fileType: 'pdf' }
) {
  const { fileType, runAllCodeChunks } = options;
  const engine = await createEngine(filePath);
  return engine.eBookExport({
    fileType,
    runAllCodeChunks
  });
}

export async function exportMarkdown(
  type: 'pdf' | 'gmf' | 'html' | 'ebook' | 'pandoc',
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
    case 'pandoc':
      render = exportPandoc;
      break;
    case 'ebook':
      render = md => exportEbook(md, { fileType: args.format || 'pdf' });
      return;
    default:
      throw Error(`unknown format ${type}`);
  }

  const files = [];
  const input = args.input.length ? args.input : ['README.md'];
  const paths = await globby(input);
  paths.forEach(p => files.push(p));

  options.out && files.length && (await fs.mkdirp(options.out));
  for (const md of files) {
    logger.info(`rendering ${md}`);
    const output = await render(md);
    options.out && (await fs.move(output, path.join(options.out, output)));
  }
}
