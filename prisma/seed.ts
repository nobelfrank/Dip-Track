import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create departments
  const departments = [
    { name: 'Production / Manufacturing', description: 'Runs daily glove production operations' },
    { name: 'Quality Control (QC)', description: 'Ensures gloves meet required standards' },
    { name: 'Research & Development (R&D)', description: 'Develops new glove types, coatings, and materials' },
    { name: 'Maintenance & Utilities', description: 'Keeps all systems functional' },
    { name: 'Administration', description: 'Oversees plant operations and management' }
  ]

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept
    })
  }

  // Create admin user
  const adminDept = await prisma.department.findFirst({ where: { name: 'Administration' } })
  
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  await prisma.user.upsert({
    where: { email: 'admin@diptrack.com' },
    update: {},
    create: {
      email: 'admin@diptrack.com',
      password: hashedPassword,
      fullName: 'System Administrator',
      userRoles: {
        create: { role: 'admin' }
      },
      profile: {
        create: {
          email: 'admin@diptrack.com',
          fullName: 'System Administrator',
          departmentId: adminDept?.id,
          primaryFunction: 'System Administration'
        }
      }
    }
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })