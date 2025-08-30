/**
 * Course Seeder
 * Creates sample courses and assigns teachers.
 */

const { Course, Teacher } = require('../models');
const { faker } = require('@faker-js/faker');

const seedCourses = async () => {
    try {
        console.log('Seeding courses...');

        // Clear existing courses
        await Course.deleteMany({});

        const teachers = await Teacher.find();
        if (teachers.length === 0) {
            console.warn('No teachers found. Please seed users first.');
            return;
        }

        const courses = [
            {
                courseCode: 'CS101',
                title: 'Introduction to Programming',
                description: 'A foundational course on programming principles using Python.',
                department: 'Computer Science',
                credits: { total: 4, theory: 3, practical: 1 },
            },
            {
                courseCode: 'CS201',
                title: 'Data Structures and Algorithms',
                description: 'In-depth study of data structures and algorithmic techniques.',
                department: 'Computer Science',
                credits: { total: 4, theory: 3, practical: 1 },
            },
            {
                courseCode: 'IT305',
                title: 'Database Management Systems',
                description: 'Learn about relational databases, SQL, and database design.',
                department: 'Information Technology',
                credits: { total: 3, theory: 3, practical: 0 },
            },
            {
                courseCode: 'EC202',
                title: 'Digital Logic Design',
                description: 'Fundamentals of digital circuits and logic gates.',
                department: 'Electronics',
                credits: { total: 3, theory: 3, practical: 0 },
            },
        ];

        for (const courseData of courses) {
            const randomTeacher = faker.helpers.arrayElement(teachers);
            const course = new Course({
                ...courseData,
                level: 'undergraduate',
                duration: { hours: 40, weeks: 14 },
                schedule: {
                    semester: 'Fall',
                    academicYear: '2025-2026',
                },
                instructors: [{
                    teacherId: randomTeacher._id,
                    role: 'primary',
                    responsibilityPercentage: 100
                }],
                enrollment: {
                    maxStudents: 60,
                    registrationStart: faker.date.soon({ days: 10 }),
                    registrationEnd: faker.date.soon({ days: 30 }),
                    dropDeadline: faker.date.soon({ days: 45 }),
                },
                status: 'published'
            });
            await course.save();
        }

        console.log('✅ Courses seeded successfully!');
    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
};

module.exports = seedCourses;
