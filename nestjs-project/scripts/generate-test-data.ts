import { DataSource } from 'typeorm'
import { UserEntity } from '../src/auth/entities/user.entity'
import { DocumentEntity } from '../src/document/entities/document.entity'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'
import { DEFAULT_PERMISSIONS, Role } from '../src/auth/enums/roles.enum'
import { RefreshTokenEntity } from '../src/auth/entities/refresh-token.entity'

async function generateUsers(dataSource: DataSource): Promise<UserEntity[]> {
  const userRepository = dataSource.getRepository(UserEntity)
  const users: UserEntity[] = []
  
  for (let i = 0; i < 1000; i++) {
    const user = new UserEntity()
    user.email = faker.internet.email()
    user.password = await bcrypt.hash('password123', 10)
    user.roles = [faker.helpers.arrayElement(Object.values(Role))]
    
    if (DEFAULT_PERMISSIONS && DEFAULT_PERMISSIONS[user.roles[0]]) {
      const defaultPermissions = DEFAULT_PERMISSIONS[user.roles[0]]
      user.permissions = Object.fromEntries(
        defaultPermissions.map(permission => [permission, true])
      )
    } else {
      console.warn(`No default permissions found for role: ${user.roles[0]}`)
      user.permissions = {}
    }
    
    users.push(user)
  }
  await userRepository.save(users)
  return users
}

async function generateDocuments(dataSource: DataSource, users: UserEntity[]) {
  const documentRepository = dataSource.getRepository(DocumentEntity)
  const batchSize = 1000
  const totalDocuments = 100000
  
  try {
    for (let i = 0; i < totalDocuments; i += batchSize) {
      const documents: DocumentEntity[] = []
      const end = Math.min(i + batchSize, totalDocuments)
      
      for (let j = i; j < end; j++) {
        const document = new DocumentEntity()
        document.title = faker.lorem.words(3)
        document.description = faker.lorem.sentence()
        document.filePath = `/uploads/${faker.system.fileName()}`
        document.fileName = faker.system.fileName()
        document.mimeType = 'application/pdf'
        document.size = faker.number.int({ min: 1000, max: 1000000 })
        document.uploadDate = faker.date.past()
        document.metadata = {
          author: faker.person.fullName(),
          keywords: faker.lorem.words(5),
          category: faker.helpers.arrayElement(['finance', 'legal', 'hr', 'engineering'])
        }
        document.user = faker.helpers.arrayElement(users)
        document.createdAt = faker.date.past()
        document.updatedAt = faker.date.recent()
        documents.push(document)
      }
      
      await documentRepository.save(documents)
      console.log(`Saved documents ${i + 1} to ${end}`)
    }
  } catch (error) {
    console.error('Error generating documents:', error)
    throw error
  }
}

// Initialize and run
const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'mydatabase',
  entities: [UserEntity, DocumentEntity, RefreshTokenEntity], // Added RefreshTokenEntity
  synchronize: true,
})

dataSource.initialize()
  .then(async () => {
    const users = await generateUsers(dataSource)
    await generateDocuments(dataSource, users)
    console.log('Test data generated successfully!')
  })
  .catch(error => console.error('Error generating test data:', error))