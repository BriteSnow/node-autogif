import * as nodePath from 'path';
import { unlink } from 'fs';
import { spawn } from 'p-spawn';
import { async as fastGlob } from 'fast-glob';
import { remove } from 'fs-extra';
import { watch as _watcher } from 'chokidar';

export async function generate(dir: string) {
	const movFiles = await glob([`${dir}/*.mov`]);
	console.log(`From dir ${dir} found ${movFiles.length} .mov files`);
	for (let movFile of movFiles) {
		makeAGif(movFile);
	}
}

export async function watch(dir: string) {
	const watcher = _watcher('*.mov', { persistent: true, cwd: dir, awaitWriteFinish: true });

	const gifGen = async (path: string) => {
		await makeAGif(nodePath.join(dir, path));
	}

	watcher.on('change', gifGen);
	watcher.on('add', gifGen);
}

async function makeAGif(moveFile: string) {
	const dir = nodePath.dirname(moveFile);
	const baseName = nodePath.basename(moveFile);
	const onlyName = nodePath.basename(moveFile, '.mov');
	const paletteName = `${onlyName}-palette.png`;

	console.log(`${baseName} ->> ${onlyName}.gif`);

	try {
		// e.g., ffmpeg -y -i test-01.mov -vf fps=10,scale=-1:-1:flags=lanczos,palettegen palette.png
		const ffPalette = await spawn('ffmpeg', ['-y', '-i', baseName, '-vf', 'fps=10,scale=-1:-1:flags=lanczos,palettegen', paletteName], { cwd: dir, capture: ["stdout", "stderr"] });
		// e.g., ffmpeg -y -i test-01.mov -i palette.png -filter_complex "fps=10,scale=-1:-1:flags=lanczos[x];[x][1:v]paletteuse" output.gif
		const ffGif = await spawn('ffmpeg', ['-y', '-i', baseName, '-i', paletteName, '-filter_complex', 'fps=10,scale=-1:-1:flags=lanczos[x];[x][1:v]paletteuse', `${onlyName}.gif`], { cwd: dir, capture: ["stdout", "stderr"] });
		await saferRemove(nodePath.join(dir, paletteName));
	} catch (ex) {
		console.log(`Error while ${baseName} ->> ${onlyName}.gif `, ex);
	}
}

// --------- Utils --------- //
async function glob(patterns: string[]) {
	const entries = await fastGlob(patterns);
	return entries.map(entryItem => (typeof entryItem === 'string') ? entryItem : entryItem.path);
}

async function saferRemove(path: string) {
	if (!path || !path.includes('Downloads')) {
		throw new Error(`Path ${path} does not seem to be safe to delete`);
	}
	await remove(path);
}
// --------- /Utils --------- //