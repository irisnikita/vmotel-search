import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import { appConfig } from './constant';

const markDownPath = path.join(process.cwd(), 'Docs/Introduce');

export async function getMarkDown(content) {
    if (content) {
        // Use remark to convert markdown into HTML string
        const processedContent = await remark()
            .use(html)
            .process(content)

        const contentHtml = processedContent.toString()

        // Combine the data with the id
        return contentHtml
    }
}

export function getListMarkDowns() {
    // Get file names under /posts
    const allMarkDownData = appConfig.introduces.map(introduce => {
        // Remove ".md" from file name to get id
        const id = introduce.id

        // Read markdown file as string
        const fullPath = path.join(markDownPath, introduce.markDown)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            id,
            background: introduce.background,
            contentHtml: matterResult.content,
            ...matterResult.data
        }
    })

    return allMarkDownData;
}