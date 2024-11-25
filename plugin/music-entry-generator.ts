import { PluginOption } from 'vite'
import * as fs from 'fs'
import path from 'path'
import { ListEntry } from './list-entry'
import { Music } from './music'

export default function musicEntryGeneator(): PluginOption {
  const virtualModuleId = 'virtual:music-list.json'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'music-entry-generator',
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
        for (const x of dirs) {
          try {
            const filepath = path.join(base, x, 'index.json')
            this.addWatchFile(filepath)
            const content = fs.readFileSync(filepath, {
              encoding: 'utf-8',
            })
            const data = JSON.parse(content) as Music
            entries.push({
              vol: data.vol,
              title: data.title,
              cover: `/data/entries/${x}/${data.cover}`,
              date: data.date,
              artist: data.artist,
              album: data.album,
              theme_color: data.theme_color,
              href: `/music/${x}`,
            })
            entries.sort((a, b) => {
              return Date.parse(a.date) - Date.parse(b.date)
            })
          } catch (err) {
            console.error(err)
          }
        }
        console.log('successfully transformed music entries.')
        return JSON.stringify(entries)
      }
    },
    // handleHotUpdate({ server, file }) {
    //   if (file.includes('public/data/entries')) {
    //     const thisModule = server.moduleGraph.getModuleById(
    //       resolvedVirtualModuleId,
    //     )
    //     if (thisModule) return [thisModule]
    //   }
    // },
  }
}
