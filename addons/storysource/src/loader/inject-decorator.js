import defaultOptions from './default-options';

import {
  generateSourceWithDecorators,
  generateStorySource,
  generateAddsMap,
} from './generate-helpers';

function extendOptions(source, comments, filepath, options) {
  return {
    ...defaultOptions,
    ...options,
    source,
    comments,
    filepath,
  };
}

function inject(source, decorator, resourcePath, options = {}) {
  // console.log('options1================:\n', options);
  const { changed, source: newSource, comments } = generateSourceWithDecorators(
    source,
    decorator,
    options.parser
  );

  console.log('changed:', changed);
  if (!changed) {
    return {
      source: newSource,
      addsMap: {},
      changed,
    };
  }

  const filepath = resourcePath;
  const storySource = generateStorySource(extendOptions(source, comments, filepath, options));
  const addsMap = generateAddsMap(storySource, options.parser);

  return {
    source: newSource,
    storySource,
    addsMap,
    changed,
  };
}

export default inject;
