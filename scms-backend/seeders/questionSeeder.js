/**
 * Question Seeder
 * Creates sample questions for existing courses.
 */

const { Question, Course, Teacher } = require('../models');
const { faker } = require('@faker-js/faker');
const { QUESTION_TYPES } = require('../utils/constants');

const seedQuestions = async () => {
    try {
        console.log('Seeding questions...');

        // Clear existing questions
        await Question.deleteMany({});

        const courses = await Course.find();
        const teachers = await Teacher.find();

        if (courses.length === 0 || teachers.length === 0) {
            console.warn('Cannot seed questions without courses and teachers.');
            return;
        }

        const questions = [];

        for (const course of courses) {
            const randomTeacher = faker.helpers.arrayElement(teachers);

            // Create 10 Multiple Choice questions per course
            for (let i = 0; i < 10; i++) {
                const options = [];
                for (let j = 0; j < 4; j++) {
                    options.push({
                        text: faker.lorem.sentence(5),
                        isCorrect: j === 0 // Make the first option correct
                    });
                }

                questions.push({
                    questionText: `What is the primary concept of ${course.title} related to ${faker.hacker.noun()}?`,
                    type: QUESTION_TYPES.MULTIPLE_CHOICE,
                    courseId: course._id,
                    createdBy: randomTeacher._id,
                    topic: `Unit ${faker.number.int({ min: 1, max: 5 })}`,
                    difficulty: faker.helpers.arrayElement(['easy', 'medium', 'hard']),
                    bloomsLevel: faker.helpers.arrayElement(['remember', 'understand', 'apply']),
                    questionData: {
                        options: faker.helpers.shuffle(options) // Shuffle options
                    },
                    defaultMarks: faker.helpers.arrayElement([1, 2, 5]),
                    status: 'published'
                });
            }

            // Create 5 True/False questions per course
            for (let i = 0; i < 5; i++) {
                 questions.push({
                    questionText: `Is it true that ${faker.hacker.verb()} is a key part of ${course.title}?`,
                    type: QUESTION_TYPES.TRUE_FALSE,
                    courseId: course._id,
                    createdBy: randomTeacher._id,
                    topic: `Unit ${faker.number.int({ min: 1, max: 3 })}`,
                    difficulty: 'easy',
                    bloomsLevel: 'remember',
                    questionData: {
                        correctAnswer: faker.datatype.boolean()
                    },
                    defaultMarks: 1,
                    status: 'published'
                });
            }
        }

        await Question.insertMany(questions);
        console.log(`✅ ${questions.length} Questions seeded successfully!`);

    } catch (error) {
        console.error('Error seeding questions:', error);
        process.exit(1);
    }
};

module.exports = seedQuestions;
