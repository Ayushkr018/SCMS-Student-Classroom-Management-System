/**
 * Authentication Controller
 * Handles user authentication, registration, and password management
 */

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { 
  sendSuccessResponse, 
  sendErrorResponse,
  sendCreatedResponse
} = require('../utils/response');
const { generateTokenPair, verifyToken, generateResetToken } = require('../utils/jwtUtils');
const { USER_ROLES, USER_STATUS } = require('../utils/constants');
const crypto = require('crypto');

/**
 * Register new user
 */
const register = catchAsync(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role,
    phone,
    dateOfBirth
  } = req.body;

  // Validate password confirmation
  if (password !== confirmPassword) {
    return sendErrorResponse(res, 400, 'Passwords do not match');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return sendErrorResponse(res, 409, 'User with this email already exists');
  }

  // Create user
  const userData = {
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
    role: role || USER_ROLES.STUDENT,
    phone,
    dateOfBirth,
    status: USER_STATUS.PENDING // Require email verification
  };

  const user = await User.create(userData);

  // Create role-specific profile
  let profileData = null;
  try {
    if (role === USER_ROLES.STUDENT || !role) {
      profileData = await Student.create({
        userId: user._id,
        rollNumber: `STU${Date.now()}`,
        admissionNumber: `ADM${Date.now()}`,
        admissionDate: new Date(),
        currentSemester: 1,
        branch: 'Computer Science', // Default, can be updated later
        program: 'Undergraduate',
        batch: `${new Date().getFullYear()}-${new Date().getFullYear() + 4}`,
        parentDetails: {
          father: { name: 'To be updated' },
          mother: { name: 'To be updated' }
        },
        address: {
          permanent: {
            street: 'To be updated',
            city: 'To be updated',
            state: 'To be updated',
            country: 'India',
            pincode: '000000'
          }
        },
        emergencyContact: {
          name: 'To be updated',
          relation: 'Parent',
          phone: '0000000000'
        }
      });
    } else if (role === USER_ROLES.TEACHER) {
      profileData = await Teacher.create({
        userId: user._id,
        employeeId: `EMP${Date.now()}`,
        designation: 'Assistant Professor',
        department: 'Computer Science', // Default
        joiningDate: new Date(),
        employmentType: 'permanent',
        salary: {
          basic: 50000,
          allowances: 10000,
          deductions: 5000
        },
        qualifications: [{
          degree: 'Masters',
          field: 'Computer Science',
          institution: 'To be updated',
          yearOfCompletion: new Date().getFullYear() - 2
        }]
      });
    }
  } catch (profileError) {
    // If profile creation fails, delete the user
    await User.findByIdAndDelete(user._id);
    return sendErrorResponse(res, 500, 'Failed to create user profile');
  }

  // Generate email verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send verification email (implement in mailService)
  console.log(`Verification token for ${email}: ${verificationToken}`);

  // Remove sensitive information
  user.password = undefined;
  user.emailVerificationToken = undefined;

  sendCreatedResponse(res, {
    user,
    profile: profileData,
    message: 'Registration successful. Please check your email for verification link.'
  }, 'User registered successfully');
});

/**
 * User login
 */
const login = catchAsync(async (req, res) => {
  const { email, password, rememberMe = false } = req.body;

  // Find user and include password for verification
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return sendErrorResponse(res, 401, 'Invalid email or password');
  }

  // Check user status
  if (user.status !== USER_STATUS.ACTIVE) {
    return sendErrorResponse(res, 401, 'Account is not active. Please contact administrator or verify your email.');
  }

  // Update last login information
  await user.updateLastLogin();

  // Generate tokens
  const tokens = generateTokenPair({
    id: user._id,
    email: user.email,
    role: user.role
  });

  // Remove sensitive information
  user.password = undefined;

  // Set cookies (optional)
  if (rememberMe) {
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  sendSuccessResponse(res, 200, 'Login successful', {
    user,
    tokens
  });
});

/**
 * Refresh access token
 */
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return sendErrorResponse(res, 401, 'Refresh token is required');
  }

  // Verify refresh token
  const decoded = verifyToken(refreshToken, 'refresh');
  
  if (!decoded || decoded.expired || decoded.invalid) {
    return sendErrorResponse(res, 401, 'Invalid or expired refresh token');
  }

  // Find user
  const user = await User.findById(decoded.id);
  if (!user || user.status !== USER_STATUS.ACTIVE) {
    return sendErrorResponse(res, 401, 'User not found or inactive');
  }

  // Generate new tokens
  const tokens = generateTokenPair({
    id: user._id,
    email: user.email,
    role: user.role
  });

  sendSuccessResponse(res, 200, 'Token refreshed successfully', { tokens });
});

/**
 * Logout user
 */
const logout = catchAsync(async (req, res) => {
  // Clear cookies
  res.clearCookie('refreshToken');
  
  // In a real implementation, you might want to:
  // 1. Add the token to a blacklist
  // 2. Update user's last activity
  // 3. Log the logout event

  sendSuccessResponse(res, 200, 'Logout successful');
});

/**
 * Get current user profile
 */
const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password -emailVerificationToken -passwordResetToken');

  if (!user) {
    return sendErrorResponse(res, 404, 'User not found');
  }

  // Get role-specific profile
  let profileData = null;
  if (user.role === USER_ROLES.STUDENT) {
    profileData = await Student.findOne({ userId: user._id });
  } else if (user.role === USER_ROLES.TEACHER) {
    profileData = await Teacher.findOne({ userId: user._id });
  }

  sendSuccessResponse(res, 200, 'Profile retrieved successfully', {
    user,
    profile: profileData
  });
});

/**
 * Update current user profile
 */
const updateMe = catchAsync(async (req, res) => {
  const updates = req.body;

  // Remove fields that shouldn't be updated via this endpoint
  delete updates.password;
  delete updates.email;
  delete updates.role;
  delete updates.status;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { 
      new: true, 
      runValidators: true,
      select: '-password -emailVerificationToken -passwordResetToken'
    }
  );

  sendSuccessResponse(res, 200, 'Profile updated successfully', user);
});

/**
 * Change password
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return sendErrorResponse(res, 400, 'New passwords do not match');
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return sendErrorResponse(res, 400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  sendSuccessResponse(res, 200, 'Password changed successfully');
});

/**
 * Forgot password - send reset email
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    // Don't reveal that user doesn't exist
    return sendSuccessResponse(res, 200, 'If an account with that email exists, a password reset link has been sent.');
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send reset email (implement in mailService)
  console.log(`Password reset token for ${email}: ${resetToken}`);

  sendSuccessResponse(res, 200, 'If an account with that email exists, a password reset link has been sent.');
});

/**
 * Reset password with token
 */
const resetPassword = catchAsync(async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return sendErrorResponse(res, 400, 'Passwords do not match');
  }

  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user by token and check if token is still valid
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return sendErrorResponse(res, 400, 'Token is invalid or has expired');
  }

  // Update password and clear reset token
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Generate new tokens for automatic login
  const tokens = generateTokenPair({
    id: user._id,
    email: user.email,
    role: user.role
  });

  sendSuccessResponse(res, 200, 'Password reset successful', { tokens });
});

/**
 * Verify email with token
 */
const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.body;

  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user by token and check if token is still valid
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return sendErrorResponse(res, 400, 'Token is invalid or has expired');
  }

  // Update user status and clear verification token
  user.emailVerified = true;
  user.status = USER_STATUS.ACTIVE;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  sendSuccessResponse(res, 200, 'Email verified successfully. Your account is now active.');
});

/**
 * Resend verification email
 */
const resendVerificationEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return sendErrorResponse(res, 404, 'User not found');
  }

  if (user.emailVerified) {
    return sendErrorResponse(res, 400, 'Email is already verified');
  }

  // Generate new verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send verification email (implement in mailService)
  console.log(`New verification token for ${email}: ${verificationToken}`);

  sendSuccessResponse(res, 200, 'Verification email sent successfully');
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail
};
