import prettier from 'prettier';
import { patchNode } from './parse-helpers';
import { splitSTORYOF, findAddsMap } from './traverse-helpers';
import getParser from './parsers';

function isUglyComment(comment, uglyCommentsRegex) {
  return uglyCommentsRegex.some(regex => regex.test(comment));
}

function generateSourceWithoutUglyComments(source, { comments, uglyCommentsRegex }) {
  let lastIndex = 0;
  const parts = [source];

  comments
    .filter(comment => isUglyComment(comment.value.trim(), uglyCommentsRegex))
    .map(patchNode)
    .forEach(comment => {
      parts.pop();

      const start = source.slice(lastIndex, comment.start);
      const end = source.slice(comment.end);

      parts.push(start, end);
      lastIndex = comment.end;
    });

  return parts.join('');
}

function prettifyCode(source, { prettierConfig, parser, filepath }) {
  let config = prettierConfig;

  if (!config.parser && parser && parser !== 'javascript') {
    config = {
      ...prettierConfig,
      parser,
    };
  } else if (filepath) {
    config = {
      ...prettierConfig,
      filepath,
    };
  }

  console.log('before prettify================:\n', config);

  return prettier.format(source, config);
}

export function generateSourceWithDecorators(source, decorator, parserType) {
  const parser = getParser(parserType);
  const ast = parser.parse(source);

  const { comments = [] } = ast;

  const parts = splitSTORYOF(ast, source);

  const newSource = parts.join(decorator);

  return {
    changed: parts.length > 1,
    source: newSource,
    comments,
  };
}

export function generateAddsMap(source, parserType) {
  const parser = getParser(parserType);
  const ast = parser.parse(source);

  return findAddsMap(ast);
}

export function generateStorySource({ source, ...options }) {
  let storySource = source;
  // console.log('options2================:\n', options);

  console.log('generateStorysource', options);
  storySource = generateSourceWithoutUglyComments(storySource, options);
  storySource = prettifyCode(storySource, options);

  return storySource;
}
