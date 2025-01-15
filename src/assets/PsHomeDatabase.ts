import { readFile } from 'node:fs/promises';

export const objectDatabase = (await readFile('./src/assets/PsHomeDatabase.psv', 'utf8'))
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