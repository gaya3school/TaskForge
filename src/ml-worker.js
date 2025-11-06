// src/ml-worker.js

import { pipeline } from '@xenova/transformers';

// This is the core worker function that listens for commands
self.addEventListener('message', async (event) => {
     const { id, task, model, args } = event.data;

     try {
          const pipe = await pipeline(task, model);
          const result = await pipe(...args);
          self.postMessage({ id, result });
     } catch (e) {
          self.postMessage({ id, error: e.toString() });
     }
});