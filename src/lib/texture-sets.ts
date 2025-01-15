import { readdir } from "node:fs/promises";
import path from "node:path";

export class Texset {
    constructor(
        public readonly source: string,
        public readonly name: string,
        public readonly categories: Category[],
    ) {}

    get root() {
        return path.join(texsetsDir, this.source, this.name);
    }
}

export class Category {
    constructor(
        public readonly name: string,
        public readonly textures: string[],
    ) {}
}

const texsetsDir = './public/by-author';

export const texsets: Texset[] = [];

for (const author of await readdir(texsetsDir)) {
    for (const texsetName of await readdir(path.join(texsetsDir, author))) {
        const texset = new Texset(author, texsetName, []);

        const categoryNames = await readdir(texset.root);
        for (const category of categoryNames) {
            const categoryPath = path.join(texset.root, category);
            const files = await readdir(categoryPath, { withFileTypes: true, recursive: true });
            texset.categories.push(
                new Category(
                    category,
                    files
                        .filter((file) => file.isFile())
                        .map((file) => path.join(file.parentPath, file.name))
                )
            );
        }

        texsets.push(texset);
    }
}

export function getTexset(source: string, name: string) {
    return texsets.find(texset => texset.source === source && texset.name === name);
}