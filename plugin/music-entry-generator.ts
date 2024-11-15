import { PluginOption } from 'vite'
import * as fs from 'fs'
import path from 'path'
import { ListEntry } from './list-entry'
import { Music } from './music'

export default function musicEntryGeneator(): PluginOption {
  const virtualModuleId = 'virtual:music-list.json'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'music-entry-generator', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        console.log('transforming music entries...')
        const base = path.join(process.cwd(), './public/data/entries')
        const dirs = fs.readdirSync(base)
        const entries: ListEntry[] = []
        dirs.forEach(x => {
          try {
            const filepath = path.join(base, x, 'index.json')
            const content = fs.readFileSync(filepath, {
              encoding: 'utf-8',
            })
            const data = JSON.parse(content) as Music
            entries.push({
              vol: data.vol,
              title: data.title,
              cover: data.cover,
              date: data.date,
              artist: data.artist,
              album: data.album,
              theme_color: data.theme_color,
              href: `/music/${x}`,
            })
          } catch (err) {
            console.error(err)
          }
        })
        console.log('successfully transformed music entries.')
        return JSON.stringify(entries)
      }
    },
  }
}
