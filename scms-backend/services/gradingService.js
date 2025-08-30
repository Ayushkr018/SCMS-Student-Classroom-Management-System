/**
 * Grading Service
 * Handles complex grading logic, including CGPA/SGPA calculations and grade reports
 */

const { Grade, Student, Course } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { GRADE_SCALE } = require('../utils/constants');
const mongoose = require('mongoose');

class GradingService {

  /**
   * Calculates the final grade for a specific submission or assessment.
   * @param {Object} gradeData - Contains score, maxScore, penalties, etc.
   * @returns {Object} { finalScore, percentage, letterGrade, gradePoints }
   */
  calculateFinalGrade(gradeData) {
    const { scoreObtained, maxScore, extraCredit = 0, penalty = 0 } = gradeData;

    if (scoreObtained === null || scoreObtained === undefined || maxScore === null || maxScore === undefined) {
      throw new AppError('Score and Max Score are required for grade calculation.', 400);
    }

    const finalScore = Math.max(0, scoreObtained + extraCredit - penalty);
    const percentage = Math.min(100, Math.max(0, (finalScore / maxScore) * 100));
    const letterGrade = this.getLetterGradeFromPercentage(percentage);
    const gradePoints = this.getGradePointsFromPercentage(percentage);

    return {
      finalScore: parseFloat(finalScore.toFixed(2)),
      percentage: parseFloat(percentage.toFixed(2)),
      letterGrade,
      gradePoints
    };
  }

  /**
   * Calculates the Semester Grade Point Average (SGPA) for a student.
   * @param {string} studentId - The ID of the student.
   * @param {string} academicYear - The academic year (e.g., '2024-2025').
   * @param {string} semester - The semester (e.g., 'Fall').
   * @returns {number} The calculated SGPA.
   */
  async calculateSGPA(studentId, academicYear, semester) {
    const grades = await Grade.find({
      studentId,
      academicYear,
      semester
    });

    if (grades.length === 0) {
      return 0;
    }

    let totalCreditPoints = 0;
    let totalCredits = 0;

    grades.forEach(grade => {
      if (grade.gradePoints !== null && grade.credits !== null && grade.credits > 0) {
        totalCreditPoints += grade.gradePoints * grade.credits;
        totalCredits += grade.credits;
      }
    });

    if (totalCredits === 0) {
      return 0;
    }

    const sgpa = totalCreditPoints / totalCredits;
    return parseFloat(sgpa.toFixed(2));
  }

  /**
   * Calculates the Cumulative Grade Point Average (CGPA) for a student.
   * @param {string} studentId - The ID of the student.
   * @returns {number} The calculated CGPA.
   */
  async calculateCGPA(studentId) {
    const pipeline = [
      { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: null,
          totalCreditPoints: { $sum: { $multiply: ['$gradePoints', '$credits'] } },
          totalCredits: { $sum: '$credits' }
        }
      }
    ];
  
    const result = await Grade.aggregate(pipeline);
  
    if (result.length === 0 || !result[0] || result[0].totalCredits === 0) {
      return 0;
    }
  
    const cgpa = result[0].totalCreditPoints / result[0].totalCredits;
    
    // Update the student's profile with the new CGPA
    await Student.findByIdAndUpdate(studentId, { cgpa: parseFloat(cgpa.toFixed(2)) });
    
    return parseFloat(cgpa.toFixed(2));
  }

  /**
   * Generates a detailed grade report for a student for a specific course.
   * @param {string} studentId - The ID of the student.
   * @param {string} courseId - The ID of the course.
   * @returns {Object} A detailed grade report.
   */
  async generateCourseGradeReport(studentId, courseId) {
    const [student, course, grades] = await Promise.all([
      Student.findById(studentId).populate('userId', 'firstName lastName'),
      Course.findById(courseId).populate('instructors.teacherId', 'firstName lastName'),
      Grade.find({ studentId, courseId }).sort('assessmentType')
    ]);

    if (!student || !course) {
      throw new AppError('Student or Course not found', 404);
    }

    let weightedTotal = 0;
    grades.forEach(grade => {
      weightedTotal += (grade.percentage / 100) * grade.weightage;
    });
    
    const finalPercentage = parseFloat(weightedTotal.toFixed(2));
    const finalLetterGrade = this.getLetterGradeFromPercentage(finalPercentage);
    
    return {
      student: {
        id: student._id,
        name: `${student.userId.firstName} ${student.userId.lastName}`,
        rollNumber: student.rollNumber
      },
      course: {
        id: course._id,
        title: course.title,
        code: course.courseCode
      },
      assessments: grades.map(g => ({
        type: g.assessmentType,
        score: g.scoreObtained,
        maxScore: g.maxScore,
        percentage: g.percentage,
        weightage: g.weightage
      })),
      finalResult: {
        finalPercentage,
        finalLetterGrade
      },
      generatedAt: new Date()
    };
  }

  /**
   * Converts a percentage score to a letter grade based on the defined scale.
   * @param {number} percentage - The percentage score.
   * @returns {string} The corresponding letter grade.
   */
  getLetterGradeFromPercentage(percentage) {
    for (const grade in GRADE_SCALE) {
      const { min, max } = GRADE_SCALE[grade];
      if (percentage >= min && percentage <= max) {
        return grade.replace('_', '').replace('PLUS', '+');
      }
    }
    return 'F';
  }
  
  /**
   * Converts a percentage score to grade points based on the defined scale.
   * @param {number} percentage - The percentage score.
   * @returns {number} The corresponding grade points.
   */
  getGradePointsFromPercentage(percentage) {
    for (const grade in GRADE_SCALE) {
      const { min, max, gpa } = GRADE_SCALE[grade];
      if (percentage >= min && percentage <= max) {
        return gpa;
      }
    }
    return 0.0;
  }
}

module.exports = new GradingService();
