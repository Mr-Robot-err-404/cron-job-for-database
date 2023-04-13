import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function fetchData(category:number){
    try {
      const data = await prisma.creator.findMany({
        where: {
          category: category
        },
        select: {
          id: true,
          title: true,
          createdAt: false,
          updatedAt: false, 
          subs: true, 
          views: true, 
          weeklyViews: true, 
          monthlyViews: true, 
          videoNum: true, 
          recentVid: true, 
          popularVid: true, 
          rank: true, 
          picture: true, 
          category: true
        }
      })
      return data
    } catch (error) {
      console.log(error)
    }
  }