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
                ).replace(/\\/g, '/');

                builtCategory.textures.push(`https://tu-canvas.github.io/${repo}/${gallery}/${category}/${relativePath}`);
            }
        }
    }
}


const flatRepos = await readdir('./texsets-flat');
for (const repo of flatRepos) {
    const texset: Texset = {
        source: repo,
        name: repo,
        categories: [],
    };
    builtTexsets.push(texset);

    const images = await readdir(`./texsets-flat/${repo}`);
    const categories = Object.groupBy(
        images.filter(e => e !== '.git'),
        image => image.match(/^([A-Za-z]+)/)?.[1] ?? 'Other'
    );
    for (const category of Object.keys(categories)) {
        const builtCategory: Category = {
            name: category,
            textures: [],
        };
        texset.categories.push(builtCategory);

        for (const image of categories[category]!) {
            builtCategory.textures.push(`https://tu-canvas.github.io/${repo}/${image}`);
        }
    }
}

await writeFile('./src/assets/texsets.json', JSON.stringify(builtTexsets, null, 4));