const crypto = require('crypto')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 12

/**
 * @function hashPassword
 * @param {string} password
 * @return {Promise<string>} Hashed password
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * @function comparePassword
 * @param {string} password
 * @param {string} hashedPassword
 * @return {Promise<boolean>} Returns true if password matches
 */
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * @function hash (Legacy - kept for backward compatibility)
 * @param {string} data
 * @param {string} salt
 * @param {string} algorithm
 * @return {string} Hashed Value
 */
function hash(data, salt, algorithm = 'sha256') {
  return crypto.createHmac(algorithm, salt).update(data).digest('hex')
}

function createId(algorithm = 'sha256') {
  const uniqueId = crypto.randomBytes(16).toString('hex');

    const orderId = crypto.createHash(algorithm).update(uniqueId).digest('hex')

    return orderId.slice(0,12);
}

module.exports = {
  hash,
  hashPassword,
  comparePassword,
  createId,
}
