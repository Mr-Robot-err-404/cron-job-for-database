import { Rank } from '../interfaces/Rank'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export function sortNewCreators(arr:any[]): [any[], any[], Rank] {
    let copy = [...arr]
    let rank: Rank = {}
    const subOrder = arr.sort((a:any,b:any) => parseInt(b.statistics.subscriberCount) - parseInt(a.statistics.subscriberCount))
    const viewOrder = copy.sort((a:any,b:any) => parseInt(b.statistics.viewCount) - parseInt(a.statistics.viewCount))
    for(var i = 0; i < subOrder.length; i++){
      const subId = subOrder[i].id
      rank[subId] = [0,0]
      rank[subId][0] = i + 1
    }
    for(var i = 0; i < viewOrder.length;i++){
      const viewId = viewOrder[i].id 
      rank[viewId][1] = i + 1
    }
    return [subOrder, viewOrder, rank]
  }

  async function postCreators(arr: any[], rank:Rank) {
    for(var i = 0; i < arr.length; i++){
      const subRank:number = rank[arr[i].id][0]
      const vidRank:number = rank[arr[i].id][1]
      const snippet = arr[i].snippet
      const stats = arr[i].statistics
      const profilePic = snippet.thumbnails.default.url
      try {
        await prisma.creator.create({
          data: {
            id: arr[i].id, 
            title: snippet.title,
            subs: {
              1:[stats.subscriberCount],
            },
            views: {
              1:[stats.viewCount],
            },
            videoNum: {
              1:[stats.videoCount],
            },
            rank: {
              1: [{0:subRank, 1:vidRank}],
            },
            picture: profilePic,
            category: 2
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }