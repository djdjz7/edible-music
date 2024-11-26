import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import * as path from 'path'
import type { Music } from './music'

const examptedProperties = [
  'lyrics',
  'intro',
  'apple_music_link',
  'qq_music_link',
  'netease_music_link',
]

const entriesRoot = '../public/data/entries'

const dirs = await fs.readdir(entriesRoot)

for (const dir of dirs) {
  const currentBase = path.join(entriesRoot, dir)
  const indexFileDir = path.join(currentBase, 'index.json')
  const indexFile = await fs.readFile(indexFileDir, 'utf-8')
  const music = JSON.parse(indexFile) as Music
  console.log(chalk.yellow(music.title), chalk.green(music.date))
  for (const property in music) {
    if (examptedProperties.includes(property)) {
      continue
    }
    if (music[property as keyof Music]) continue
    if (
      (property === 'lyrics_excerpt_start_time' ||
        property === 'lyrics_excerpt_end_time') &&
      !music.lyrics
    )
      continue
    console.log(chalk.red(`Property ${property} is missing`))
    const answer = await input({
      message: `Enter value for ${property}:`,
    })
    music[property as keyof Music] = answer as string & string[]
  }
  const newIndexFile = JSON.stringify(music, null, 2)
  await fs.writeFile(indexFileDir, newIndexFile)
}
