/**
 * User Seeder
 * Creates sample admin, teacher, and student users.
 */

const { User, Student, Teacher } = require('../models');
const { faker } = require('@faker-js/faker');
const { USER_ROLES } = require('../utils/constants');

const seedUsers = async () => {
  try {
    console.log('Seeding users...');

    // Clear existing users and profiles
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});

    const users = [];
    const students = [];
    const teachers = [];

    // --- Create Super Admin ---
    const adminUser = new User({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@scms.com',
      password: 'Password123!', // Will be hashed by pre-save hook
      role: USER_ROLES.ADMIN,
      emailVerified: true,
      status: 'active',
    });
    users.push(adminUser);

    // --- Create Teachers ---
    for (let i = 0; i < 5; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const teacherUser = new User({
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        password: 'Password123!',
        role: USER_ROLES.TEACHER,
        emailVerified: true,
        status: 'active',
      });
      users.push(teacherUser);

      teachers.push({
        userId: teacherUser._id,
        employeeId: `EMP${faker.string.numeric(6)}`,
        designation: faker.helpers.arrayElement(['Assistant Professor', 'Professor']),
        department: faker.helpers.arrayElement(['Computer Science', 'Information Technology', 'Electronics']),
        joiningDate: faker.date.past({ years: 5 }),
        employmentType: 'permanent',
        salary: { basic: faker.number.int({ min: 50000, max: 80000 }), allowances: 10000, deductions: 5000 },
        qualifications: [{
            degree: 'Masters',
            field: 'Computer Science',
            institution: `${faker.location.city()} University`,
            yearOfCompletion: 2015
        }]
      });
    }

    // --- Create Students ---
    for (let i = 0; i < 50; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const studentUser = new User({
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        password: 'Password123!',
        role: USER_ROLES.STUDENT,
        emailVerified: true,
        status: 'active',
      });
      users.push(studentUser);

      students.push({
        userId: studentUser._id,
        rollNumber: `STU${faker.string.numeric(6)}`,
        admissionNumber: `ADM${faker.string.numeric(8)}`,
        admissionDate: faker.date.past({ years: 2 }),
        currentSemester: faker.number.int({ min: 1, max: 8 }),
        branch: faker.helpers.arrayElement(['Computer Science', 'Information Technology']),
        program: 'Undergraduate',
        batch: '2022-2026',
        parentDetails: { father: { name: faker.person.fullName({ sex: 'male' }) }, mother: { name: faker.person.fullName({ sex: 'female' }) } },
        address: { permanent: { street: faker.location.streetAddress(), city: faker.location.city(), state: faker.location.state(), pincode: faker.location.zipCode() } },
        emergencyContact: { name: faker.person.fullName(), relation: 'Parent', phone: faker.phone.number() }
      });
    }

    // Insert all documents
    await User.insertMany(users);
    await Student.insertMany(students);
    await Teacher.insertMany(teachers);

    console.log('✅ Users, Students, and Teachers seeded successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

module.exports = seedUsers;
