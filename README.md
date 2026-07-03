# skill-run-audit

Audit agent skill runs for plan, validation, and side-effect boundary evidence.

## Quickstart

```sh
npm test
npm run smoke
node src/cli.js fixtures/sample.jsonl --format json
```

## What it checks

- Missing plans or action evidence.
- Validation gaps before handoff.
- Approval and dry-run boundary drift.
- Fixture shape problems that make a review hard to trust.

## CLI

```sh
skill-run-audit <fixture.jsonl|notes.txt> [--format markdown|json] [--output report.md]
```

## Library

```js
import { runAudit } from 'skill-run-audit';

const report = runAudit(rawTranscript, { format: 'markdown' });
```

## Safety notes

This package is local-first. It reads fixtures, prints reports, and does not call live connector APIs. Treat critical findings as blockers before approving external actions.

## Limitations

The analyzer is intentionally deterministic and rule-based. It cannot prove intent, authenticate account state, or replace human review for sensitive operations.
