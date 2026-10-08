// Preview the read-only contract requests without credentials or network access.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routes = JSON.parse(await readFile(new URL('../routes.json', import.meta.url), 'utf8'));
assert.ok(routes.length > 0);
for (const route of routes) {
  assert.ok(route.path.startsWith('/'));
  assert.match(route.expect, /^\d{3}(\|\d{3})*$/);
}
console.log(JSON.stringify({ source: 'local route manifest; no OCE request', count: routes.length, routes: routes.map(({ name, path, expect }) => ({ name, method: 'GET', path, expectedHttp: expect })) }, null, 2));
