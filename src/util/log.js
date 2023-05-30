import {inspect} from 'util-ex'

export function log(msg, type, depth) {
  if (isNaN(depth)) {depth = 10}
  if (!type) {type = 'log'}
  console[type](inspect(msg, {depth: depth}));
}

export default log
