import type { Texset, Category } from "@/lib/texture-sets";
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const builtTexsets: Texset[] = [];
const repos = await readdir('./texsets');
for (const repo of repos) {
    const galleries = await readdir(`./texsets/${repo}`);
    for (const gallery of galleries) {
        if (gallery === '.git') continue;

        const texset: Texset = {
            source: repo,
            name: gallery,
            categories: [],
        };
        builtTexsets.push(texset);

        const categories = await readdir(`./texsets/${repo}/${gallery}`);
        for (const category of categories) {
            const builtCategory: Category = {
                name: category,
                textures: [],
            };
            texset.categories.push(builtCategory);

            const files = await readdir(`./texsets/${repo}/${gallery}/${category}`, { withFileTypes: true, recursive: true });
            for (const file of files) {
                if (!file.isFile()) {
                    continue;
                }

                const relativePath = path.relative(
                    `./texsets/${repo}/${gallery}/${category}`,
                    path.join(file.parentPath, file.name)
                );

                builtCategory.textures.push(`https://tu-canvas.github.io/${repo}/${gallery}/${category}/${relativePath}`);
            }
        }
    }
}

await writeFile('./src/assets/texsets.json', JSON.stringify(builtTexsets, null, 4));