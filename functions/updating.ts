import axios from "axios"
import { Rank } from "../interfaces/Rank"
import { PrismaClient } from '@prisma/client'
import { isCurrDayEven } from "./isCurrDayEven"
const prisma = new PrismaClient()

export async function updateRecentVid(arr:any[], page:string) {
    let order:string = "date"
    let key:any
    let isDayEven:boolean = isCurrDayEven()
    if(isDayEven) {
      if(page === 'webdev') key = process.env.API_KEY_8
      else if(page = 'gamedev') key = process.env.API_KEY_9
      else key = process.env.API_KEY_12
    }
    else {
      if(page === 'webdev') key = process.env.API_KEY_18
      else if(page = 'gamedev') key = process.env.API_KEY_17
      else key = process.env.API_KEY_3
    }

    for(var i = 0; i < arr.length; i++){
      let id = arr[i].id
      try {
        let res = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet%20&channelId=${id}&maxResults=1&order=${order}&key=${key}`)
        const vidId = res.data.items[0].id.videoId
        await prisma.creator.update({
            where: {id: id}, 
            data: {
              recentVid: vidId
            }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  export async function updatePopularVid(arr:any[], page:string) {
    let order:string = "viewCount"
    let key:any
    let isDayEven:boolean = isCurrDayEven()
    if(isDayEven) {
      if(page === 'webdev') key = process.env.API_KEY_13
      else if(page === 'gamedev') key = process.env.API_KEY_14
      else key = process.env.API_KEY_11
    }
    else {
      if(page === 'webdev') key = process.env.API_KEY_16
      else if(page === 'gamedev') key = process.env.API_KEY_15
      else key = process.env.API_KEY_5
    }
   

    for(var i = 0; i < arr.length; i++){
      let id = arr[i].id
      try {
        let res = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet%20&channelId=${id}&maxResults=1&order=${order}&key=${key}`)
        const vidId = res.data.items[0].id.videoId
        await prisma.creator.update({
            where: {id: id}, 
            data: {
              popularVid: vidId
            }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

 export async function updateCreators(currArr: any[], newData:any[], rank:Rank, category:number) {
    for(var i = 0; i < newData.length; i++){
      let id = newData[i].id
      let currData
      for(var j = 0; j < newData.length; j++) {
        if(currArr[j].id === id) {
          currData = currArr[j]
          break
        }
      }
      if(!currData) continue
      let isMonthFinished:boolean = false
      const totalMonths:number = Object.keys(currData.subs).length
      const recentMonth = currData.subs[totalMonths]
      const newMonth:number = totalMonths + 1
      if(recentMonth.length >= 30) isMonthFinished = true
      
      const subRank:number = rank[newData[i].id][0]
      const vidRank:number = rank[newData[i].id][1]
      const snippet = newData[i].snippet
      const stats = newData[i].statistics
      const profilePic = snippet.thumbnails.default.url

      if(isMonthFinished) {
        try {
          await prisma.creator.update({
            where: {id: newData[i].id},
            data: {
              subs: {
                  ...currData.subs, 
                  [newMonth] : [stats.subscriberCount], 
              },
              views: {
                  ...currData.views, 
                  [newMonth]: [stats.viewCount], 
              },
              videoNum: {
                  ...currData.videoNum, 
                  [newMonth]: [stats.videoCount], 

              },
              rank: {
                  ...currData.rank, 
                  [newMonth]: [{0:subRank, 1:vidRank}], 
              },
              picture: profilePic,
              category: category
            }
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          await prisma.creator.update({
            where: {id: newData[i].id},
            data: {
              subs: {
                  ...currData.subs, 
                  [totalMonths]: [...currData.subs[`${totalMonths}`], stats.subscriberCount], 
              },
              views: {
                  ...currData.views, 
                  [totalMonths]: [...currData.views[`${totalMonths}`], stats.viewCount], 
              },
              videoNum: {
                  ...currData.videoNum, 
                  [totalMonths]: [...currData.videoNum[`${totalMonths}`], stats.videoCount], 
              },
              rank: {
                  ...currData.rank, 
                  [totalMonths]: [...currData.rank[`${totalMonths}`], {0:subRank, 1:vidRank}], 
              },
              picture: profilePic,
              category: category
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }