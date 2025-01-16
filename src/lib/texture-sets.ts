import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface Texset {
    source: string;
    name: string;
    categories: Category[];
}

export interface Category {
    name: string;
    textures: string[];
}

export const texsets: Texset[] = JSON.parse(await readFile('./src/assets/texsets.json', 'utf8'));

export function getTexset(source: string, name: string) {
    return texsets.find(texset => texset.source === source && texset.name === name);
}