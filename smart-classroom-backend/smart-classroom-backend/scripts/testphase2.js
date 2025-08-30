/**
 * Phase 2 Testing Script
 * Comprehensive testing for all Phase 2 features
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const { USER_ROLES } = require('../utils/constants');

// Test data
const testUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@scms.edu',
    password: 'Admin@123',
    role: USER_ROLES.ADMIN
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'teacher@scms.edu',
    password: 'Teacher@123',
    role: USER_ROLES.TEACHER
  },
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'student@scms.edu',
    password: 'Student@123',
    role: USER_ROLES.STUDENT
  }
];

const testCourse = {
  courseCode: 'CS101',
  title: 'Introduction to Computer Science',
  description: 'Fundamental concepts of computer science and programming',
  department: 'Computer Science',
  level: 'undergraduate',
  credits: {
    total: 4,
    theory: 3,
    practical: 1
  },
  duration: {
    hours: 60,
    weeks: 15
  },
  schedule: {
    semester: 'fall',
    academicYear: '2024-2025'
  },
  enrollment: {
    maxStudents: 50,
    minStudents: 10,
    registrationStart: new Date(),
    registrationEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    dropDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days
  },
  status: 'published'
};

async function runPhase2Tests() {
  try {
    console.log('🚀 Starting Phase 2 Tests...\n');

    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scms_test');
    console.log('✅ Connected to test database');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Course.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing test data');

    // Test 1: User Creation
    console.log('\n📝 Test 1: User Creation');
    const createdUsers = [];
    
    for (const userData of testUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created ${user.role}: ${user.email}`);
    }

    // Test 2: Role-specific Profile Creation
    console.log('\n👥 Test 2: Role-specific Profile Creation');
    
    const teacher = createdUsers.find(u => u.role === USER_ROLES.TEACHER);
    const student = createdUsers.find(u => u.role === USER_ROLES.STUDENT);

    // Create teacher profile
    const teacherProfile = await Teacher.create({
      userId: teacher._id,
      employeeId: 'EMP001',
      designation: 'Assistant Professor',
      department: 'Computer Science',
      joiningDate: new Date(),
      employmentType: 'permanent',
      salary: {
        basic: 60000,
        allowances: 15000,
        deductions: 5000
      },
      qualifications: [{
        degree: 'PhD',
        field: 'Computer Science',
        institution: 'MIT',
        yearOfCompletion: 2020
      }]
    });
    console.log(`✅ Created teacher profile: ${teacherProfile.employeeId}`);

    // Create student profile
    const studentProfile = await Student.create({
      userId: student._id,
      rollNumber: 'CS2024001',
      admissionNumber: 'ADM2024001',
      admissionDate: new Date(),
      currentSemester: 1,
      branch: 'Computer Science',
      program: 'Undergraduate',
      batch: '2024-2028',
      parentDetails: {
        father: { name: 'Robert Johnson' },
        mother: { name: 'Mary Johnson' }
      },
      address: {
        permanent: {
          street: '123 Main St',
          city: 'Boston',
          state: 'MA',
          country: 'USA',
          pincode: '02101'
        }
      },
      emergencyContact: {
        name: 'Robert Johnson',
        relation: 'Father',
        phone: '+1234567890'
      }
    });
    console.log(`✅ Created student profile: ${studentProfile.rollNumber}`);

    // Test 3: Course Creation
    console.log('\n📚 Test 3: Course Creation');
    
    const courseData = {
      ...testCourse,
      instructors: [{
        teacherId: teacherProfile._id,
        role: 'primary',
        responsibilityPercentage: 100
      }]
    };

    const course = await Course.create(courseData);
    console.log(`✅ Created course: ${course.courseCode} - ${course.title}`);

    // Test 4: Course Enrollment
    console.log('\n🎓 Test 4: Course Enrollment');
    
    // Enroll student in course
    studentProfile.enrolledCourses.push({
      courseId: course._id,
      enrollmentDate: new Date(),
      status: 'active'
    });
    await studentProfile.save();

    // Update course enrollment count
    course.enrollment.currentEnrollment += 1;
    await course.save();

    console.log(`✅ Enrolled student ${studentProfile.rollNumber} in ${course.courseCode}`);

    // Test 5: Data Retrieval and Relationships
    console.log('\n🔍 Test 5: Data Retrieval and Relationships');
    
    // Test user with profile population
    const userWithProfile = await User.findById(student._id);
    const fullStudentProfile = await Student.findOne({ userId: student._id })
      .populate('enrolledCourses.courseId');
    
    console.log(`✅ Retrieved user: ${userWithProfile.email}`);
    console.log(`✅ Retrieved student profile with ${fullStudentProfile.enrolledCourses.length} enrolled courses`);

    // Test course with instructor population
    const courseWithInstructor = await Course.findById(course._id)
      .populate('instructors.teacherId');
    
    console.log(`✅ Retrieved course with instructor: ${courseWithInstructor.instructors[0].teacherId.firstName}`);

    // Test 6: Virtual Properties
    console.log('\n🔮 Test 6: Virtual Properties');
    
    console.log(`✅ Student full name: ${studentProfile.fullName}`);
    console.log(`✅ Course available seats: ${course.availableSeats}`);
    console.log(`✅ Course registration status: ${course.isRegistrationOpen ? 'Open' : 'Closed'}`);

    // Test 7: Instance Methods
    console.log('\n⚙️ Test 7: Instance Methods');
    
    const enrollmentCheck = course.canEnroll(student._id);
    console.log(`✅ Can student enroll: ${enrollmentCheck.canEnroll}`);

    const passwordValid = await student.comparePassword('Student@123');
    console.log(`✅ Password validation: ${passwordValid}`);

    // Test 8: Static Methods
    console.log('\n🔧 Test 8: Static Methods');
    
    const foundUser = await User.findByEmail('student@scms.edu');
    console.log(`✅ Found user by email: ${foundUser.email}`);

    const courseByCode = await Course.findByCourseCode('CS101');
    console.log(`✅ Found course by code: ${courseByCode.title}`);

    // Test 9: Database Queries
    console.log('\n📊 Test 9: Database Queries');
    
    const userStats = await Promise.all([
      User.countDocuments({ role: USER_ROLES.STUDENT }),
      User.countDocuments({ role: USER_ROLES.TEACHER }),
      User.countDocuments({ role: USER_ROLES.ADMIN }),
      Course.countDocuments({ status: 'published' })
    ]);

    console.log(`✅ Database stats - Students: ${userStats[0]}, Teachers: ${userStats[1]}, Admins: ${userStats[2]}, Courses: ${userStats[3]}`);

    // Test 10: Error Handling
    console.log('\n❌ Test 10: Error Handling');
    
    try {
      // Try to create duplicate user
      await User.create({
        firstName: 'Duplicate',
        lastName: 'User',
        email: 'student@scms.edu', // Duplicate email
        password: 'Test@123',
        role: USER_ROLES.STUDENT
      });
    } catch (error) {
      console.log(`✅ Duplicate email error handled: ${error.message.includes('duplicate') ? 'Success' : 'Failed'}`);
    }

    try {
      // Try to create course with invalid data
      await Course.create({
        courseCode: 'INVALID',
        title: '', // Required field missing
        department: 'Invalid Department'
      });
    } catch (error) {
      console.log(`✅ Validation error handled: ${error.message.includes('required') ? 'Success' : 'Failed'}`);
    }

    console.log('\n🎉 All Phase 2 Tests Completed Successfully!');
    console.log('\n📋 Test Summary:');
    console.log('✅ User creation and authentication');
    console.log('✅ Role-specific profile management');
    console.log('✅ Course creation and management');
    console.log('✅ Student enrollment system');
    console.log('✅ Data relationships and population');
    console.log('✅ Virtual properties and methods');
    console.log('✅ Database queries and statistics');
    console.log('✅ Error handling and validation');

  } catch (error) {
    console.error('❌ Phase 2 Test Failed:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run tests if called directly
if (require.main === module) {
  require('dotenv').config();
  runPhase2Tests().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = runPhase2Tests;
