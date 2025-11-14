import fs from 'fs';
import path from 'path';

const root = process.cwd();
const badEntries = [];

function walk(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (['.git', '.next', 'node_modules'].includes(entry.name)) {
			continue;
		}

		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			walk(fullPath);
			continue;
		}

		if (!entry.name.endsWith('.json')) {
			continue;
		}

		try {
			JSON.parse(fs.readFileSync(fullPath, 'utf8'));
		} catch (error) {
			badEntries.push({ file: path.relative(root, fullPath), message: error.message });
		}
	}
}

walk(root);

if (badEntries.length === 0) {
	console.log('All JSON files parsed successfully.');
} else {
	for (const entry of badEntries) {
		console.log(`${entry.file}: ${entry.message}`);
	}
	process.exitCode = 1;
}


