# OCE × Bruno — OCC API contracts

## Français

Collection [Bruno](https://www.usebruno.com/) de neuf requêtes **en lecture seule** pour OpenClaw Enterprise (OCE). Elle couvre l'installation, un namespace et son agent, l'existence d'un agent étranger, les accès accordés et refusés à une clé restreinte, puis le déploiement et l'observation du runtime. Les routes sont tirées du [contrat OpenAPI OCC](https://github.com/openclaw/openclaw-enterprise/blob/main/packages/contracts/openapi/occ-api.openapi.json). Cette collection complète la [suite de qualification OCE](https://github.com/gbesse/oce-agent-conformance), dont la sonde vérifie également un vrai tour de modèle.

Copier `environments/Example.bru` vers `environments/Local.bru` (ignoré par Git), remplacer l'URL et les identifiants, puis ajouter `adminKey` et `restrictedKey` comme secrets Bruno. La clé administrateur doit voir les deux agents ; la clé restreinte doit voir seulement l'agent autorisé. Garder `Local.bru` privé avec permissions `600` si des clés y sont enregistrées. Depuis la racine de la collection :

```sh
bru run requests --env Local
```

`npm ci && npm test` exécute la collection contre un serveur local simulé, y compris un cas de fuite entre namespaces qui doit faire échouer Bruno. `npm run generate` reconstruit les fichiers `.bru` à partir de `routes.json`. Aucun contrôle CI public n'accède à une installation OCE ou à des clés réelles. Licence MIT.

## English

A nine-request, **read-only** [Bruno](https://www.usebruno.com/) collection for OpenClaw Enterprise (OCE). It checks the installation, a namespace and agent, existence of a foreign agent, allowed and denied access for a restricted key, deployment status, and runtime observation. Routes come from the [OCC OpenAPI contract](https://github.com/openclaw/openclaw-enterprise/blob/main/packages/contracts/openapi/occ-api.openapi.json). It complements the [OCE conformance suite](https://github.com/gbesse/oce-agent-conformance), which also probes a real model turn.

Copy `environments/Example.bru` to `environments/Local.bru` (Git ignored), replace the URL and IDs, and add `adminKey` and `restrictedKey` as Bruno secrets. The administrator key must see both agents; the restricted key must see only the allowed agent. Keep `Local.bru` private with `600` permissions if you store keys there. From the collection root, run the command above.

`npm ci && npm test` runs the collection against a local mock server, including a cross-namespace leak that must make Bruno fail. `npm run generate` rebuilds the `.bru` files from `routes.json`. Public CI accesses no live OCE installation or real keys. MIT licensed.

## Español

Colección [Bruno](https://www.usebruno.com/) de nueve peticiones **de solo lectura** para OpenClaw Enterprise (OCE). Comprueba la instalación, un espacio de nombres y su agente, la existencia de un agente ajeno, los accesos permitidos y denegados para una clave restringida, el despliegue y la observación del runtime. Las rutas proceden del [contrato OpenAPI OCC](https://github.com/openclaw/openclaw-enterprise/blob/main/packages/contracts/openapi/occ-api.openapi.json). Complementa la [suite de conformidad OCE](https://github.com/gbesse/oce-agent-conformance), que también comprueba un turno real del modelo.

Copia `environments/Example.bru` a `environments/Local.bru` (ignorado por Git), sustituye la URL y los identificadores y añade `adminKey` y `restrictedKey` como secretos Bruno. La clave de administración debe ver ambos agentes; la restringida solo el permitido. Mantén `Local.bru` privado con permisos `600` si guardas claves allí. Ejecuta el comando anterior desde la raíz de la colección.

`npm ci && npm test` ejecuta la colección contra un servidor local simulado, incluido un caso de fuga entre espacios de nombres que debe hacer fallar Bruno. `npm run generate` reconstruye los archivos `.bru` a partir de `routes.json`. La CI pública no accede a instalaciones OCE ni a claves reales. Licencia MIT.
