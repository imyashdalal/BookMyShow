const AppError = require('../errors/app.error')
const User = require('../models/user.model')
const {
  userSignupValidationSchema,
  userSigninValidationSchema,
} = require('../lib/validators/auth.validators')
const AuthService = require('../services/auth.service')

async function handleSignup(req, res) {
  const validationResult = await userSignupValidationSchema.safeParseAsync(
    req.body
  )

  if (validationResult.error)
    return res.status(400).json({ error: validationResult.error })

  const { firstname, lastname, email, password } = validationResult.data

  try {
    const token = await AuthService.signupWithEmailAndPassword({
      firstname,
      lastname,
      email,
      password,
    })

    return res.status(201).json({ status: 'success', data: { token } })
  } catch (err) {
    if (err instanceof AppError)
      return res.status(err.code).json({ status: 'error', error: err.message })

    console.log(`Error`, err)
    return res
      .status(500)
      .json({ status: 'error', error: 'Internal Server Error' })
  }
}

async function handleSignin(req, res) {
  const validationResult = await userSigninValidationSchema.safeParseAsync(
    req.body
  )

  if (validationResult.error)
    return res.status(400).json({ error: validationResult.error })

  const { email, password } = validationResult.data

  try {
    const token = await AuthService.signinWithEmailAndPassword({
      email,
      password,
    })
    return res.status(201).json({ status: 'success', data: { token } })
  } catch (err) {
    if (err instanceof AppError)
      return res.status(err.code).json({ status: 'error', error: err.message })

    console.log(`Error`, err)
    return res
      .status(500)
      .json({ status: 'error', error: 'Internal Server Error' })
  }
}

async function handleMe(req, res) {
  if (!req.user) return res.json({ isLoggedIn: false })

  const user = await User.findById(req.user._id).select({
    firstname: true,
    lastname: true,
    email: true,
    role: true,
  })

  return res.json({ isLoggedIn: true, data: { user } })
}

async function handleUpdateProfile(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { firstname, lastname } = req.body;

  if (!firstname || !lastname) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstname, lastname },
      { new: true, runValidators: true }
    ).select({
      firstname: true,
      lastname: true,
      email: true,
      role: true,
    });

    return res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    console.log(`Error updating profile:`, err);
    return res.status(500).json({ status: 'error', error: 'Failed to update profile' });
  }
}

module.exports = {
  handleSignup,
  handleSignin,
  handleMe,
  handleUpdateProfile,
}
