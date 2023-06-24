import { AutoPoster } from 'topgg-autoposter';
import { ClientAndCommands } from "../bot"


export const createStatsHook = (client: ClientAndCommands) => {
  if (!process.env.TOPGG_TOKEN) return;

  const poster = AutoPoster(process.env.TOPGG_TOKEN, client)

  poster.on('posted', (stats) => {
    console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
  })
}
