import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
// const bcrypt = require('bcrypt');
// import bcrypt from 'bcrypt'


async function main() {
  const sampleCategories = await Promise.all([
    {
      name: 'Điện nước',
      list: [""]
    },
    {
      name: 'Ăn uống',
      list: [""]
    },
    {
      name: 'Bạn bè',
      list: [""]
    },
    {
      name: 'Khoản khác',
      list: [""]
    }
  ].map(v => prisma.categorySample.create({
    data: {
      name: v.name,
      list: JSON.stringify(v.list)
    }
  })))
  console.log('Successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })