import { input, editor, select } from '@inquirer/prompts'
import * as fs from 'fs/promises'
import * as path from 'path'
import { type Music } from './music'

const entriesRoot = '../public/data/entries'

const type = await select({
  message: 'Select type:',
  choices: ['VOL', 'SP'],
})
let lastEntry = 0
const dirs = await fs.readdir(entriesRoot)
switch (type) {
  case 'SP':
    for (const dir of dirs) {
      const jsonPath = path.join(entriesRoot, dir, 'index.json')
      const music: Music = JSON.parse(await fs.readFile(jsonPath, 'utf-8'))
      if (music.vol.startsWith('SP')) {
        const t = music.vol.replace('SP', '').trim()
        const num = Number.parseInt(t)
        if (num > lastEntry) lastEntry = num
      }
    }
    break
  case 'VOL':
    for (const dir of dirs) {
      const jsonPath = path.join(entriesRoot, dir, 'index.json')
      const music: Music = JSON.parse(await fs.readFile(jsonPath, 'utf-8'))
      if (music.vol.startsWith('VOL')) {
        const t = music.vol.replace('VOL', '').trim()
        const num = Number.parseInt(t)
        if (num > lastEntry) lastEntry = num
      }
    }
    break
}

const vol = await input({
  message: 'Vol string:',
  default: `${type} ${(lastEntry + 1).toString().padStart(3, '0')}`,
})

const title = await input({
  message: 'Title:',
})

const album = await input({
  message: 'Album:',
})

const artist = await input({
  message: 'Artist:',
})

const date = await input({
  message: 'Date (YYYY-MM-DD):',
})

const coverUrl = await input({
  message: 'Cover URL:',
})

const thisDir = path.join(entriesRoot, `${date}-${title}`)
await fs.mkdir(thisDir)
const coverResponse = await fetch(coverUrl)
let cover = ''
if (coverResponse.ok) {
  let fileExt = coverUrl.split('/').pop()?.split('.').pop()
  fileExt = await input({
    message: 'Cover file extension:',
    default: fileExt,
  })
  cover = `cover.${fileExt}`
  const coverData = await coverResponse.arrayBuffer()
  await fs.writeFile(path.join(thisDir, cover), Buffer.from(coverData))
}

const theme_color = await input({
  message: 'Theme color (hex code):',
})

const text_theme_color = await input({
  message: 'Text theme color (hex code):',
})

const apple_music_link = await input({
  message: 'Apple Music link:',
})

const qq_music_link = await input({
  message: 'QQ Music link:',
})

const netease_music_link = await input({
  message: 'Netease Music link:',
})

const wechat_link = await input({
  message: 'WeChat link:',
})

const intro = (
  await editor({
    message: 'Intro:',
  })
).trim()

const intro_author = await input({
  message: 'Intro author:',
})

const lyricsStr = await editor({
  message: 'Lyrics:',
})

const lyrics = lyricsStr
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)

const music: Music = {
  vol,
  title,
  album,
  artist,
  date,
  cover,
  theme_color,
  text_theme_color,
  apple_music_link,
  qq_music_link,
  netease_music_link,
  wechat_link,
  intro,
  intro_author,
  lyrics,
}

const jsonPath = path.join(thisDir, 'index.json')
await fs.writeFile(jsonPath, JSON.stringify(music, null, 2))

console.log('Entry created successfully.')
