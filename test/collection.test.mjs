import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const routes = JSON.parse(await readFile(new URL('../routes.json', import.meta.url), 'utf8'));

function runBruno(port) {
  return new Promise((resolve, reject) => {
    const args = ['run', 'requests', '--env', 'Example',
      '--env-var', `baseUrl=http://127.0.0.1:${port}`,
      '--env-var', 'adminKey=admin-test-key',
      '--env-var', 'restrictedKey=restricted-test-key',
      '--env-var', 'allowedNamespace=ns_allowed',
      '--env-var', 'allowedAgent=agt_allowed',
      '--env-var', 'foreignNamespace=ns_foreign',
      '--env-var', 'foreignAgent=agt_foreign',
      '--env-var', 'deploymentId=dep_active'];
    const child = spawn('./node_modules/.bin/bru', args, { cwd: new URL('../', import.meta.url) });
    let output = '';
    child.stdout.on('data', (data) => { output += data; });
    child.stderr.on('data', (data) => { output += data; });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, output }));
  });
}

async function withServer(leak, callback) {
  const received = [];
  const server = createServer((request, response) => {
    received.push({ method: request.method, path: request.url, key: request.headers['x-api-key'] });
    const restricted = request.headers['x-api-key'] === 'restricted-test-key';
    const foreign = request.url.includes('ns_foreign');
    let status = 200;
    let data;
    if (restricted && foreign && !leak) status = 403;
    else if (request.url === '/installation') data = { id: 'ins_test' };
    else if (request.url === '/namespaces/ns_allowed') data = { id: 'ns_allowed', status: 'ready' };
    else if (request.url === '/namespaces/ns_foreign') data = { id: 'ns_foreign' };
    else if (request.url === '/namespaces/ns_allowed/agents/agt_allowed') data = { id: 'agt_allowed', activeRevisionId: 'rev_active' };
    else if (request.url === '/namespaces/ns_foreign/agents/agt_foreign') data = { id: 'agt_foreign' };
    else if (request.url.endsWith('/runtime')) data = { revisionId: 'rev_active', observedAt: new Date().toISOString(), pods: [{ ready: true }] };
    else if (request.url.endsWith('/dep_active')) data = { deploymentId: 'dep_active', status: 'succeeded', warnings: [] };
    else status = 404;
    response.writeHead(status, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ data, meta: { requestId: 'req_test' } }));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try { return await callback(server.address().port, received); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}

test('Bruno collection performs nine read-only checks with separate service keys', async () => {
  await withServer(false, async (port, received) => {
    const result = await runBruno(port);
    assert.equal(result.code, 0, result.output);
    assert.equal(received.length, routes.length);
    assert.equal(received.every((item) => item.method === 'GET'), true);
    assert.equal(received.filter((item) => item.key === 'restricted-test-key').length, 3);
  });
});

test('Bruno collection fails when a restricted key reads a foreign agent', async () => {
  await withServer(true, async (port) => {
    const result = await runBruno(port);
    assert.notEqual(result.code, 0);
  });
});
