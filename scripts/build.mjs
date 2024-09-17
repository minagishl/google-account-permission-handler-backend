import fs from 'node:fs';
import path from 'node:path';

// Rename index.js to _worker.js
fs.renameSync(path.resolve('dist/index.js'), path.resolve('dist/_worker.js'));

// Delete unnecessary files
fs.unlinkSync(path.resolve('dist/index.js.map'));
fs.unlinkSync(path.resolve('dist/README.md'));
