import { parse } from './parse.ts';

self.addEventListener('message', (e) => self.postMessage(parse(e.data)));
