import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const objectDatabase = (await readFile(path.join(__dirname, 'PsHomeDatabase.psv'), 'utf8'))
    .split('\n')
    .map(e => e.trim())
    .filter(e => e)
    .slice(1)
    .map(e => e.split('|'))
    .map(([folderName, niceName, niceDesc, category, maker, hdkVersion, PremiumOrReward, fileCount, PreferredThumbnail, SceneID, TxxxVersion, Author, Comment]) => ({
        folderName, niceName, niceDesc, category, maker, hdkVersion, PremiumOrReward, fileCount, PreferredThumbnail, SceneID, TxxxVersion, Author, Comment
    }));

console.log(objectDatabase);

export function getObjectInfo(id: string) {
    return objectDatabase.find(e => e.folderName.toLowerCase() === id.toLowerCase());
}