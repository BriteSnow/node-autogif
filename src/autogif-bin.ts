#!/usr/bin/env node
import minimist = require('minimist');
import { cwd } from 'process';
import { generate, watch } from './index';

var argv = minimist(process.argv.slice(2));

exec(argv);

async function exec(argv: minimist.ParsedArgs) {
	const dir = cwd();
	if (argv['w']) {
		watch(dir);
	} else {
		await generate(dir);
	}
}