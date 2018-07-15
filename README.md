# mume-cli

CLI wrapper arround [mume](https://github.com/shd101wyy/mume), the tool powering [markdown preview enhanced for vscode](https://shd101wyy.github.io/markdown-preview-enhanced).

- HTML export
- GFM export _(consolidated Github flavored markdown)_
- PDF export _(requires puppeteer to be installed globally)_

## install

```bash
npm install -g puppeteer
npm install -g mume-cli
mume -h
```

## usage

```bash
mume pdf --out public src/**/*.md
mume html --out public src/**/*.md
mume gfm --out docs src/**/*.md
```
