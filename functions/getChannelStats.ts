import axios from 'axios'
import { isCurrDayEven } from './isCurrDayEven'

export async function getChannelStats(arr:any[], type:string) {
    let key:any
    let isDayEven:boolean = isCurrDayEven()
    if(isDayEven) {
      if(type === 'webdev') key = process.env.API_KEY_4
      else if(type === 'gamedev') key = process.env.API_KEY_7
      else key = process.env.API_KEY_2
    }
    else {
      if(type === 'webdev') key = process.env.API_KEY_20
      else if(type === 'gamedev') key = process.env.API_KEY_19
      else key = process.env.API_KEY
    }

    let IDs = `${arr[0].id}`
    for(var i = 1; i < arr.length; i++){
      IDs += `%2C${arr[i].id}`
    }
    try {
        const { data }  =  await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&id=${IDs}&maxResults=50&key=${key}`)
        return data.items
    } catch (error) {
      console.log(error)
      return
    }
}