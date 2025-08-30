/**
 * User Controller
 * Handles all user-related operations
 */

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { 
  sendSuccessResponse, 
  sendErrorResponse,
  sendPaginatedResponse,
  sendCreatedResponse,
  sendUpdatedResponse,
  sendDeletedResponse,
  sendNotFoundResponse
} = require('../utils/response');
const { generateTokenPair } = require('../utils/jwtUtils');
const { USER_ROLES } = require('../utils/constants');

/**
 * Get all users with pagination and filtering
 */
const getAllUsers = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    role,
    status,
    department,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build filter object
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (department) filter.department = department;
  
  // Search functionality
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -emailVerificationToken -passwordResetToken')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(filter)
  ]);

  sendPaginatedResponse(res, users, parseInt(page), parseInt(limit), total);
});

/**
 * Get user by ID
 */
const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .select('-password -emailVerificationToken -passwordResetToken')
    .lean();

  if (!user) {
    return sendNotFoundResponse(res, 'User');
  }

  // Get additional profile data based on role
  let profileData = null;
  if (user.role === USER_ROLES.STUDENT) {
    profileData = await Student.findOne({ userId: id }).populate('enrolledCourses.courseId');
  } else if (user.role === USER_ROLES.TEACHER) {
    profileData = await Teacher.findOne({ userId: id }).populate('assignedCourses.courseId');
  }

  sendSuccessResponse(res, 200, 'User retrieved successfully', {
    user,
    profile: profileData
  });
});

/**
 * Create new user
 */
const createUser = catchAsync(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
    dateOfBirth,
    department
  } = req.body;

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
    role,
    phone,
    dateOfBirth,
    department
  };

  const user = await User.create(userData);

  // Create role-specific profile
  let profileData = null;
  if (role === USER_ROLES.STUDENT) {
    profileData = await Student.create({
      userId: user._id,
      rollNumber: `STU${Date.now()}`,
      admissionNumber: `ADM${Date.now()}`,
      admissionDate: new Date(),
      currentSemester: 1,
      branch: department || 'Computer Science',
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
      department: department || 'Computer Science',
      joiningDate: new Date(),
      employmentType: 'permanent',
      salary: {
        basic: 50000,
        allowances: 10000,
        deductions: 5000
      },
      qualifications: [{
        degree: 'Masters',
        field: department || 'Computer Science',
        institution: 'To be updated',
        yearOfCompletion: new Date().getFullYear() - 2
      }]
    });
  }

  // Remove sensitive information
  user.password = undefined;

  sendCreatedResponse(res, {
    user,
    profile: profileData
  }, 'User created successfully');
});

/**
 * Update user
 */
const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Remove sensitive fields that shouldn't be updated via this endpoint
  delete updates.password;
  delete updates.email;
  delete updates.role;

  const user = await User.findByIdAndUpdate(
    id,
    { ...updates, updatedAt: new Date() },
    { 
      new: true, 
      runValidators: true,
      select: '-password -emailVerificationToken -passwordResetToken'
    }
  );

  if (!user) {
    return sendNotFoundResponse(res, 'User');
  }

  sendUpdatedResponse(res, user);
});

/**
 * Delete user
 */
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return sendNotFoundResponse(res, 'User');
  }

  // Delete role-specific profile
  if (user.role === USER_ROLES.STUDENT) {
    await Student.findOneAndDelete({ userId: id });
  } else if (user.role === USER_ROLES.TEACHER) {
    await Teacher.findOneAndDelete({ userId: id });
  }

  // Delete user
  await User.findByIdAndDelete(id);

  sendDeletedResponse(res, 'User and associated profile deleted successfully');
});

/**
 * Update user password
 */
const updatePassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(id).select('+password');
  if (!user) {
    return sendNotFoundResponse(res, 'User');
  }

  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return sendErrorResponse(res, 400, 'Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  sendSuccessResponse(res, 200, 'Password updated successfully');
});

/**
 * Update user profile
 */
const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const user = await User.findById(id);
  if (!user) {
    return sendNotFoundResponse(res, 'User');
  }

  // Update user basic information
  const userUpdates = {};
  const allowedUserFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'preferences'];
  allowedUserFields.forEach(field => {
    if (updates[field] !== undefined) {
      userUpdates[field] = updates[field];
    }
  });

  if (Object.keys(userUpdates).length > 0) {
    await User.findByIdAndUpdate(id, userUpdates, { runValidators: true });
  }

  // Update role-specific profile
  let profileData = null;
  if (user.role === USER_ROLES.STUDENT && updates.studentProfile) {
    profileData = await Student.findOneAndUpdate(
      { userId: id },
      updates.studentProfile,
      { new: true, runValidators: true }
    );
  } else if (user.role === USER_ROLES.TEACHER && updates.teacherProfile) {
    profileData = await Teacher.findOneAndUpdate(
      { userId: id },
      updates.teacherProfile,
      { new: true, runValidators: true }
    );
  }

  // Get updated user data
  const updatedUser = await User.findById(id)
    .select('-password -emailVerificationToken -passwordResetToken');

  sendUpdatedResponse(res, {
    user: updatedUser,
    profile: profileData
  }, 'Profile updated successfully');
});

/**
 * Get user dashboard data
 */
const getDashboardData = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .select('-password -emailVerificationToken -passwordResetToken');

  if (!user) {
    return sendNotFoundResponse(res, 'User');
  }

  let dashboardData = {
    user,
    stats: {},
    recentActivity: [],
    notifications: []
  };

  // Role-specific dashboard data
  if (user.role === USER_ROLES.STUDENT) {
    const student = await Student.findOne({ userId: id })
      .populate('enrolledCourses.courseId', 'title courseCode credits');
    
    dashboardData.profile = student;
    dashboardData.stats = {
      enrolledCourses: student?.enrolledCourses?.length || 0,
      completedCourses: student?.enrolledCourses?.filter(c => c.status === 'completed').length || 0,
      currentCGPA: student?.cgpa || 0,
      totalCredits: student?.totalCredits || 0
    };
  } else if (user.role === USER_ROLES.TEACHER) {
    const teacher = await Teacher.findOne({ userId: id })
      .populate('assignedCourses.courseId', 'title courseCode');
    
    dashboardData.profile = teacher;
    dashboardData.stats = {
      assignedCourses: teacher?.assignedCourses?.length || 0,
      teachingHours: teacher?.teachingLoad?.currentHours || 0,
      maxTeachingHours: teacher?.teachingLoad?.maxHoursPerWeek || 18,
      publicationsCount: teacher?.publications?.length || 0
    };
  }

  sendSuccessResponse(res, 200, 'Dashboard data retrieved successfully', dashboardData);
});

/**
 * Search users
 */
const searchUsers = catchAsync(async (req, res) => {
  const { q, role, limit = 10 } = req.query;

  if (!q || q.length < 2) {
    return sendErrorResponse(res, 400, 'Search query must be at least 2 characters');
  }

  const filter = {
    $or: [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ]
  };

  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter)
    .select('firstName lastName email role profileImage')
    .limit(parseInt(limit))
    .lean();

  sendSuccessResponse(res, 200, 'Search completed successfully', users);
});

/**
 * Get user statistics
 */
const getUserStats = catchAsync(async (req, res) => {
  const stats = await Promise.all([
    User.countDocuments({ role: USER_ROLES.STUDENT }),
    User.countDocuments({ role: USER_ROLES.TEACHER }),
    User.countDocuments({ role: USER_ROLES.ADMIN }),
    User.countDocuments({ status: 'active' }),
    User.countDocuments({ 
      createdAt: { 
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
      } 
    })
  ]);

  const [students, teachers, admins, activeUsers, newUsers] = stats;

  sendSuccessResponse(res, 200, 'User statistics retrieved successfully', {
    total: students + teachers + admins,
    students,
    teachers,
    admins,
    activeUsers,
    newUsersLast30Days: newUsers
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  updateProfile,
  getDashboardData,
  searchUsers,
  getUserStats
};
