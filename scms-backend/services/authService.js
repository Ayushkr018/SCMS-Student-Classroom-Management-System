/**
 * Authentication Service
 * Handles the business logic for user authentication.
 */

const {
    User,
    Student,
    Teacher
} = require('../models');
const {
    AppError
} = require('../middleware/errorHandler');
const {
    USER_ROLES,
    USER_STATUS
} = require('../utils/constants');
const crypto = require('crypto');

class AuthService {
    /**
     * Registers a new user and their role-specific profile.
     * @param {Object} userData - The user registration data.
     * @returns {Object} { user, profile, verificationToken }
     */
    async registerUser(userData) {
        const {
            email,
            password,
            role
        } = userData;

        // 1. Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });
        if (existingUser) {
            throw new AppError('User with this email already exists', 409);
        }

        // 2. Create the base User
        const user = await User.create({
            ...userData,
            email: email.toLowerCase(),
            status: USER_STATUS.PENDING // Require email verification
        });

        // 3. Create the role-specific profile
        let profile;
        try {
            if (role === USER_ROLES.STUDENT) {
                profile = await this.createStudentProfile(user);
            } else if (role === USER_ROLES.TEACHER) {
                profile = await this.createTeacherProfile(user);
            }
        } catch (profileError) {
            // Rollback user creation if profile creation fails
            await User.findByIdAndDelete(user._id);
            throw new AppError('Failed to create user profile', 500);
        }

        // 4. Generate and save email verification token
        const verificationToken = user.createEmailVerificationToken();
        await user.save({
            validateBeforeSave: false
        });

        return {
            user,
            profile,
            verificationToken
        };
    }

    /**
     * Authenticates a user and returns their data.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @returns {Object} The authenticated user object.
     */
    async loginUser(email, password) {
        const user = await User.findOne({
            email: email.toLowerCase()
        }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            throw new AppError('Invalid email or password', 401);
        }

        if (user.status !== USER_STATUS.ACTIVE) {
            throw new AppError('Account is not active. Please contact administrator or verify your email.', 401);
        }

        await user.updateLastLogin();
        user.password = undefined; // Remove password from the returned object
        return user;
    }

    /**
     * Generates a password reset token for a user.
     * @param {string} email - The user's email.
     * @returns {Object|null} { user, resetToken } or null if user not found.
     */
    async handleForgotPassword(email) {
        const user = await User.findOne({
            email: email.toLowerCase()
        });
        if (!user) {
            return null; // Don't reveal that the user doesn't exist
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({
            validateBeforeSave: false
        });

        return {
            user,
            resetToken
        };
    }

    /**
     * Resets a user's password using a valid token.
     * @param {string} token - The password reset token.
     * @param {string} newPassword - The new password.
     * @returns {Object} The updated user object.
     */
    async handleResetPassword(token, newPassword) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
                $gt: Date.now()
            }
        });

        if (!user) {
            throw new AppError('Token is invalid or has expired', 400);
        }

        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return user;
    }

    /**
     * Verifies a user's email with a valid token.
     * @param {string} token - The email verification token.
     * @returns {Object} The updated user object.
     */
    async handleVerifyEmail(token) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: {
                $gt: Date.now()
            }
        });

        if (!user) {
            throw new AppError('Token is invalid or has expired', 400);
        }

        user.emailVerified = true;
        user.status = USER_STATUS.ACTIVE;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save({
            validateBeforeSave: false
        });

        return user;
    }

    /**
     * Helper to create a default student profile.
     * @param {Object} user - The user document.
     * @returns {Object} The created student profile.
     */
    async createStudentProfile(user) {
        return Student.create({
            userId: user._id,
            rollNumber: `STU${Date.now()}`,
            admissionNumber: `ADM${Date.now()}`,
            admissionDate: new Date(),
            currentSemester: 1,
            branch: 'Computer Science', // Default, can be updated later
            program: 'Undergraduate',
            batch: `${new Date().getFullYear()}-${new Date().getFullYear() + 4}`,
            parentDetails: {
                father: {
                    name: 'To be updated'
                },
                mother: {
                    name: 'To be updated'
                }
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
    }

    /**
     * Helper to create a default teacher profile.
     * @param {Object} user - The user document.
     * @returns {Object} The created teacher profile.
     */
    async createTeacherProfile(user) {
        return Teacher.create({
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
}

module.exports = new AuthService();
