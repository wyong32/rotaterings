import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
const guides=JSON.parse(fs.readFileSync('data/level-guides.json','utf8'));
test('Levels 26-30 include actionable state transitions rather than a claimed shortest path',()=>{
 for(let id=26;id<=30;id++){
  const guide=guides[id];
  assert.equal(guide.positionSystem,'full-frame');
  assert.equal(guide.moveCheckpoints.length,6);
  for(const move of guide.moveCheckpoints){
   assert.equal(move.row,undefined);
   assert.equal(move.column,undefined);
   for(const field of ['precondition','instruction','result','purpose','risk','parkingCheck']) assert.ok(move[field]?.length>20,`${id}: ${field}`);
  }
  assert.equal(guide.phaseMetrics.length,3);
  assert.match(guide.faqs.at(-1).answer,/selected action checkpoints/);
 }
});
