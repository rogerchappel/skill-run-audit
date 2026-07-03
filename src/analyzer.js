const EXTERNAL_MARKERS = ['send', 'post', 'publish', 'merge', 'delete', 'deploy', 'ticket', 'crm', 'slack'];

export function analyze(records) {
  const findings = [];
  const hasPlan = records.some((record) => /\bplan\b|todo|steps/.test(record.text));
  const hasValidation = records.some((record) => /validation|verified|npm test|smoke|check passed/.test(record.text));
  const skillMentioned = records.some((record) => /skill|SKILL\.md/i.test(record.text));
  const externalActions = records.filter((record) => EXTERNAL_MARKERS.some((marker) => record.text.includes(marker)));
  const approvalMentioned = records.some((record) => /approval|required|dry-run|dry run|local only/.test(record.text));

  if (!hasPlan) findings.push(finding('critical', 'missing-plan', 'No explicit plan or step list was found.'));
  if (!hasValidation) findings.push(finding('high', 'missing-validation', 'No validation command or verification result was found.'));
  if (!skillMentioned) findings.push(finding('medium', 'missing-skill-context', 'The run does not name the skill or SKILL.md guidance used.'));
  if (externalActions.length && !approvalMentioned) findings.push(finding('critical', 'external-action-without-approval-boundary', 'External action language appears without approval or dry-run boundary.'));
  if (!findings.length) findings.push(finding('info', 'ready', 'No blocking audit findings were detected.'));
  return { summary: summarize(findings), findings, stats: { records: records.length, externalActionMentions: externalActions.length } };
}

function finding(severity, code, message) {
  return { severity, code, message };
}

function summarize(findings) {
  const blockers = findings.filter((item) => ['critical', 'high'].includes(item.severity)).length;
  return { blockers, status: blockers ? 'blocked' : 'ready' };
}
