// Runs the two semantic-release plugins that read commits, against the real
// .releaserc.json, over everything since the last release tag.
//
// Catches a broken release config on a PR instead of at release time. The
// semantic-release CLI cannot do this from a pull request: it takes its branch
// from GITHUB_REF, which on a PR is the merge ref, so it skips the analysis.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { analyzeCommits } from "@semantic-release/commit-analyzer";
import { generateNotes } from "@semantic-release/release-notes-generator";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

const { preset, tagFormat } = JSON.parse(readFileSync(".releaserc.json", "utf8"));
const match = tagFormat.replace("${version}", "*");

// No tag means either a first release or, far more likely in CI, a checkout
// without tags — which would otherwise look like "nothing to release".
let lastTag;
try {
	lastTag = git("describe", "--tags", "--match", match, "--abbrev=0");
} catch {
	console.error(`No tag matching "${match}" is reachable from HEAD.`);
	console.error("If this is CI, the checkout needs fetch-depth: 0.");
	process.exit(1);
}

const commits = git("log", "--format=%H%x1f%s%x1f%b%x1e", `${lastTag}..HEAD`)
	.split("\x1e")
	.filter((entry) => entry.trim())
	.map((entry) => {
		const [hash, subject, body] = entry.replace(/^\n/, "").split("\x1f");
		return { hash, subject, body, message: body ? `${subject}\n\n${body}` : subject };
	});

const context = {
	commits,
	cwd: process.cwd(),
	logger: { log: () => {} },
	options: { repositoryUrl: git("config", "--get", "remote.origin.url") },
	lastRelease: { version: lastTag, gitTag: lastTag },
	nextRelease: { version: "0.0.0", gitTag: "0.0.0" },
};

const type = await analyzeCommits({ preset }, context);
console.log(`${commits.length} commits since ${lastTag} -> ${type ?? "no release"}`);
if (type) console.log(await generateNotes({ preset }, context));
