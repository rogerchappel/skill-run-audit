import test from 'node:test';
import assert from 'node:assert/strict';
import { parseInput } from '../src/parser.js';
import { analyze } from '../src/analyzer.js';

test('produces findings for sample fixture', () => {
  const records = parseInput(`{"role":"user","content":"Please use the repo review skill and inspect locally only."}
{"role":"assistant","type":"plan","content":"Plan: read files, analyze risks, validate with npm test."}
{"role":"assistant","type":"tool","tool":"exec_command","content":"rg TODO src"}
{"role":"assistant","content":"Validation: npm test passed. No external writes were made."}`);
  const result = analyze(records);
  assert.ok(result.findings.length >= 1);
  assert.ok(['ready', 'blocked'].includes(result.summary.status));
});

test('flags empty input as missing evidence', () => {
  const result = analyze([]);
  assert.ok(result.findings.some((finding) => finding.severity === 'critical' || finding.severity === 'high'));
});
