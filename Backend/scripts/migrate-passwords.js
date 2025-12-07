/**
 * Migration Script: Convert existing user passwords from crypto to bcrypt
 * 
 * WARNING: Run this script ONCE when upgrading security
 * This script will:
 * 1. Find all users with the old 'salt' field
 * 2. Mark them for password reset OR
 * 3. If you have access to plain passwords (not recommended), rehash them
 * 
 * Since we don't have access to plain passwords, users will need to reset passwords
 */

const mongoose = require('mongoose')
const User = require('../models/user.model')
const Logger = require('../utils/logger')

async function migratePasswords() {
  try {
    // Connect to database
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables')
    }

    await mongoose.connect(MONGODB_URI)
    Logger.info('Connected to MongoDB for migration')

    // Find users with old schema (that have 'salt' field)
    const usersWithSalt = await User.find({ salt: { $exists: true } })
    
    if (usersWithSalt.length === 0) {
      Logger.info('No users found with old password schema. Migration not needed.')
      await mongoose.disconnect()
      return
    }

    Logger.info(`Found ${usersWithSalt.length} users with old password schema`)

    // Option 1: Remove salt field (users will need to reset password)
    // This is the RECOMMENDED approach since we don't have access to plain passwords
    let migrated = 0
    for (const user of usersWithSalt) {
      try {
        // Remove the salt field
        await User.updateOne(
          { _id: user._id },
          { $unset: { salt: "" } }
        )
        migrated++
        Logger.info(`Migrated user: ${user.email}`)
      } catch (error) {
        Logger.error(`Failed to migrate user ${user.email}`, { error: error.message })
      }
    }

    Logger.info(`Migration complete. ${migrated} users updated.`)
    Logger.warn('Users with old passwords will need to reset their passwords.')
    Logger.warn('Consider implementing a password reset flow or notifying users.')

    await mongoose.disconnect()
    Logger.info('Disconnected from MongoDB')
  } catch (error) {
    Logger.error('Migration failed', { error: error.message, stack: error.stack })
    process.exit(1)
  }
}

// Run migration if executed directly
if (require.main === module) {
  require('dotenv').config()
  migratePasswords()
    .then(() => {
      console.log('Migration completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}

module.exports = migratePasswords
