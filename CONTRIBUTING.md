# Contributing

## Local setup

`example/` is an npm workspace holding the documentation site, so one install at
the root covers both packages:

```bash
npm install
npm run site        # builds the plugin, then serves the docs site
```

The site imports the plugin's `dist/`, so the plugin has to be built before the
site. `npm run site` and `npm run site:build` do that in order — reach for those
rather than running the site build on its own.

## Checks

```bash
npm run lint
npm run build
npm run check:dbml      # parses every ```dbml fence in the docs
npm run check:release   # what the current history would release
```

`check:dbml` exists because a schema that fails to parse still builds green — the
page just renders an error box instead of a diagram.

## Commit messages

This repository releases automatically, and **the commit message decides the
version**, so the format is not cosmetic.

Use [Conventional Commits](https://www.conventionalcommits.org):

| Prefix | Release |
| --- | --- |
| `fix:` | patch |
| `feat:` | minor |
| `feat!:` or a `BREAKING CHANGE:` footer | major |
| `chore:` `docs:` `ci:` `refactor:` `test:` `style:` | none |

```
feat: support a per-fence width option

fix(remark): match the dbml language case-insensitively

feat!: require react-dbml-renderer v2

BREAKING CHANGE: the renderer peer dependency moved from ^1.0.3 to ^2.0.0.
```

Prefer one logical change per commit, committed as soon as it stands on its own.

## Releasing

There is nothing to do by hand. Merging to `master` runs
[semantic-release](https://semantic-release.gitbook.io/): it reads the commits
since the last tag, works out the next version, publishes to npm and cuts a
GitHub release with generated notes.

Two things to know if you touch the release setup:

- **Tags are bare** (`1.0.8`, not `v1.0.8`) — `tagFormat` in `.releaserc.json`
  matches the tags this project already has.
- **npm trusted publishing binds to the workflow filename.** The release runs
  from `.github/workflows/publish.yml`; renaming that file, or moving the release
  step into another workflow, breaks publishing until the trusted publisher
  setting on npm is updated to match. No `NPM_TOKEN` exists, and none is needed.
