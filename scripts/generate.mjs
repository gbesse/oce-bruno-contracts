import { readFile, writeFile } from 'node:fs/promises';
const routes = JSON.parse(await readFile(new URL('../routes.json', import.meta.url), 'utf8'));
for (const [index, route] of routes.entries()) {
  const statuses = route.expect.split('|').map(Number);
  const statusCheck = statuses.length === 1
    ? `expect(res.getStatus()).to.equal(${statuses[0]});`
    : `expect(${JSON.stringify(statuses)}).to.include(res.getStatus());`;
  const bodyCode = route.assertion ? `const body = res.getBody();\n    ${route.assertion}` : '';
  const output = `meta {\n  name: ${route.name}\n  type: http\n  seq: ${index + 1}\n}\n\nget {\n  url: {{baseUrl}}${route.path}\n  body: none\n  auth: none\n}\n\nheaders {\n  x-api-key: {{${route.key}}}\n  accept: application/json\n}\n\ntests {\n  test('OCC contract / Contrat OCC / Contrato OCC', function () {\n    ${statusCheck}\n    ${bodyCode}\n  });\n}\n`;
  await writeFile(new URL(`../requests/${route.file}`, import.meta.url), output);
}
