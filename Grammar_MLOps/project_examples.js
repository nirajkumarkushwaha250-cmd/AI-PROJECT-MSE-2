// Build reproducible labelled pairs using this project's Quick Rules engine.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../checker.js'), 'utf8'), context);
const drafts = ['She go to the library.', 'He do his assignment.', 'It have a label.',
  'We is on the bus.', 'They has their tickets.', 'You is on time.'];
const rows = drafts.flatMap(draft => {
  const corrected = context.review(draft).text;
  if (corrected === draft) throw Error('Expected correction for ' + draft);
  return [draft + ',1', corrected + ',0'];
});
fs.writeFileSync(path.join(__dirname, 'project_rules.csv'), ['sentence,label', ...rows, ''].join('\n'));
