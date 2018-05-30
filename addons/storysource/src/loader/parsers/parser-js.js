import parseJs from 'prettier/parser-babylon';

function parse(source) {
  // console.log('parser-js log: ', parseJs);
  return parseJs.parsers.babylon.parse(source);
}

export default {
  parse,
};
