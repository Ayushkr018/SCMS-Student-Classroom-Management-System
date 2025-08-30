/**
 * Analytics Service
 * Advanced analytics and insights generation
 */

const {
    User,
    Student,
    Course,
    Assignment,
    Submission,
    Test,
    Grade,
} = require('../models');
const mongoose = require('mongoose');

class AnalyticsService {
  /**
   * Generate comprehensive course analytics
   */
  async getCourseAnalytics(courseId, timeframe = '30d') {
    try {
      const days = parseInt(timeframe.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [
        enrollmentStats,
        performanceStats,
        engagementStats,
        assignmentStats,
        testStats
      ] = await Promise.all([
        this.getEnrollmentStats(courseId, startDate),
        this.getPerformanceStats(courseId, startDate),
        this.getEngagementStats(courseId, startDate),
        this.getAssignmentStats(courseId, startDate),
        this.getTestStats(courseId, startDate)
      ]);

      return {
        courseId,
        timeframe,
        generatedAt: new Date(),
        enrollment: enrollmentStats,
        performance: performanceStats,
        engagement: engagementStats,
        assignments: assignmentStats,
        tests: testStats,
        insights: await this.generateCourseInsights(courseId, {
          enrollmentStats,
          performanceStats,
          engagementStats
        })
      };
    } catch (error) {
      console.error('Course analytics generation failed:', error);
      throw error;
    }
  }

  /**
   * Get enrollment statistics
   */
  async getEnrollmentStats(courseId, startDate) {
    const enrollments = await Student.aggregate([
      { $unwind: '$enrolledCourses' },
      {
        $match: {
          'enrolledCourses.courseId': mongoose.Types.ObjectId(courseId),
          'enrolledCourses.enrollmentDate': { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$enrolledCourses.enrollmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalEnrolled = await Student.countDocuments({
      'enrolledCourses.courseId': courseId,
      'enrolledCourses.status': 'active'
    });

    const dropouts = await Student.countDocuments({
      'enrolledCourses.courseId': courseId,
      'enrolledCourses.status': 'dropped'
    });

    return {
      totalEnrolled,
      dropouts,
      retentionRate: totalEnrolled > 0 ? ((totalEnrolled - dropouts) / totalEnrolled * 100).toFixed(2) : 0,
      dailyEnrollments: enrollments
    };
  }

  /**
   * Get performance statistics
   */
  async getPerformanceStats(courseId, startDate) {
    const grades = await Grade.find({
      courseId,
      gradedAt: { $gte: startDate }
    });

    if (grades.length === 0) {
      return {
        averageGrade: 0,
        distribution: {},
        passRate: 0,
        trends: []
      };
    }

    const averageGrade = grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length;
    
    const distribution = grades.reduce((acc, grade) => {
      const letterGrade = grade.letterGrade;
      acc[letterGrade] = (acc[letterGrade] || 0) + 1;
      return acc;
    }, {});

    const passRate = (grades.filter(g => g.percentage >= 40).length / grades.length * 100).toFixed(2);

    // Grade trends over time
    const trends = await Grade.aggregate([
      {
        $match: {
          courseId: mongoose.Types.ObjectId(courseId),
          gradedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$gradedAt' }
          },
          averageGrade: { $avg: '$percentage' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return {
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      distribution,
      passRate: parseFloat(passRate),
      trends,
      totalGrades: grades.length
    };
  }

  /**
   * Get engagement statistics
   */
  async getEngagementStats(courseId, startDate) {
    const submissions = await Submission.find({
      assignmentId: {
        $in: await Assignment.find({ courseId }).distinct('_id')
      },
      submittedAt: { $gte: startDate }
    });

    const onTimeSubmissions = submissions.filter(s => !s.isLate).length;
    const lateSubmissions = submissions.filter(s => s.isLate).length;

    // Calculate daily activity
    const dailyActivity = await Submission.aggregate([
      {
        $lookup: {
          from: 'assignments',
          localField: 'assignmentId',
          foreignField: '_id',
          as: 'assignment'
        }
      },
      {
        $match: {
          'assignment.courseId': mongoose.Types.ObjectId(courseId),
          submittedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' }
          },
          submissions: { $sum: 1 },
          uniqueStudents: { $addToSet: '$studentId' }
        }
      },
      {
        $project: {
          _id: 1,
          submissions: 1,
          uniqueStudents: { $size: '$uniqueStudents' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return {
      totalSubmissions: submissions.length,
      onTimeSubmissions,
      lateSubmissions,
      onTimeRate: submissions.length > 0 ? (onTimeSubmissions / submissions.length * 100).toFixed(2) : 0,
      dailyActivity
    };
  }

  /**
   * Get assignment statistics
   */
  async getAssignmentStats(courseId, startDate) {
    const assignments = await Assignment.find({
      courseId,
      createdAt: { $gte: startDate }
    });

    const assignmentSubmissions = await Submission.aggregate([
      {
        $lookup: {
          from: 'assignments',
          localField: 'assignmentId',
          foreignField: '_id',
          as: 'assignment'
        }
      },
      {
        $match: {
          'assignment.courseId': mongoose.Types.ObjectId(courseId)
        }
      },
      {
        $group: {
          _id: '$assignmentId',
          totalSubmissions: { $sum: 1 },
          averageScore: { $avg: '$grading.score' },
          onTimeCount: {
            $sum: { $cond: [{ $eq: ['$isLate', false] }, 1, 0] }
          }
        }
      }
    ]);

    return {
      totalAssignments: assignments.length,
      publishedAssignments: assignments.filter(a => a.status === 'published').length,
      draftAssignments: assignments.filter(a => a.status === 'draft').length,
      submissionStats: assignmentSubmissions,
      averageSubmissionRate: assignmentSubmissions.length > 0 ?
        (assignmentSubmissions.reduce((sum, stat) => sum + stat.totalSubmissions, 0) / assignmentSubmissions.length).toFixed(2) : 0
    };
  }

  /**
   * Get test statistics
   */
  async getTestStats(courseId, startDate) {
    const tests = await Test.find({
      courseId,
      createdAt: { $gte: startDate }
    });

    return {
      totalTests: tests.length,
      publishedTests: tests.filter(t => t.status === 'published').length,
      activeTests: tests.filter(t => t.isActive).length,
      completedTests: tests.filter(t => t.status === 'completed').length
    };
  }

  /**
   * Generate AI-powered insights
   */
  async generateCourseInsights(courseId, stats) {
    const insights = [];

    // Enrollment insights
    if (stats.enrollmentStats.retentionRate < 80) {
      insights.push({
        type: 'warning',
        category: 'enrollment',
        title: 'Low Retention Rate',
        description: `Course retention rate is ${stats.enrollmentStats.retentionRate}%, which is below the recommended 80%`,
        recommendation: 'Consider reviewing course content and engagement strategies'
      });
    }

    // Performance insights
    if (stats.performanceStats.averageGrade < 70) {
      insights.push({
        type: 'alert',
        category: 'performance',
        title: 'Below Average Performance',
        description: `Class average is ${stats.performanceStats.averageGrade}%, indicating students may be struggling`,
        recommendation: 'Consider additional support materials or review sessions'
      });
    }

    if (stats.performanceStats.passRate < 70) {
      insights.push({
        type: 'critical',
        category: 'performance',
        title: 'Low Pass Rate',
        description: `Only ${stats.performanceStats.passRate}% of students are passing`,
        recommendation: 'Immediate intervention needed - review curriculum difficulty and teaching methods'
      });
    }

    // Engagement insights
    if (stats.engagementStats.onTimeRate < 75) {
      insights.push({
        type: 'warning',
        category: 'engagement',
        title: 'Late Submission Issue',
        description: `Only ${stats.engagementStats.onTimeRate}% of submissions are on time`,
        recommendation: 'Consider adjusting deadlines or providing better time management resources'
      });
    }

    // Positive insights
    if (stats.performanceStats.averageGrade > 85) {
      insights.push({
        type: 'positive',
        category: 'performance',
        title: 'Excellent Performance',
        description: `Class average of ${stats.performanceStats.averageGrade}% shows strong student understanding`,
        recommendation: 'Continue current teaching methods and consider advanced topics'
      });
    }

    return insights;
  }

  /**
   * Generate student analytics
   */
  async getStudentAnalytics(studentId, timeframe = '30d') {
    try {
      const days = parseInt(timeframe.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [
        performanceStats,
        submissionStats,
        courseProgress,
        gradeHistory
      ] = await Promise.all([
        this.getStudentPerformanceStats(studentId, startDate),
        this.getStudentSubmissionStats(studentId, startDate),
        this.getStudentCourseProgress(studentId),
        this.getStudentGradeHistory(studentId, startDate)
      ]);

      return {
        studentId,
        timeframe,
        generatedAt: new Date(),
        performance: performanceStats,
        submissions: submissionStats,
        courseProgress,
        gradeHistory,
        insights: await this.generateStudentInsights(studentId, {
          performanceStats,
          submissionStats,
          courseProgress
        })
      };
    } catch (error) {
      console.error('Student analytics generation failed:', error);
      throw error;
    }
  }

  /**
   * Get student performance statistics
   */
  async getStudentPerformanceStats(studentId, startDate) {
    const grades = await Grade.find({
      studentId,
      gradedAt: { $gte: startDate }
    }).populate('courseId');

    if (grades.length === 0) {
      return {
        averageGrade: 0,
        totalAssessments: 0,
        courseBreakdown: {}
      };
    }

    const averageGrade = grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length;
    
    const courseBreakdown = grades.reduce((acc, grade) => {
      const courseId = grade.courseId._id.toString();
      const courseName = grade.courseId.title;
      
      if (!acc[courseId]) {
        acc[courseId] = {
          courseName,
          grades: [],
          average: 0
        };
      }
      
      acc[courseId].grades.push(grade.percentage);
      acc[courseId].average = acc[courseId].grades.reduce((sum, g) => sum + g, 0) / acc[courseId].grades.length;
      
      return acc;
    }, {});

    return {
      averageGrade: parseFloat(averageGrade.toFixed(2)),
      totalAssessments: grades.length,
      courseBreakdown
    };
  }

  /**
   * Generate student insights
   */
  async generateStudentInsights(studentId, stats) {
    const insights = [];

    // Performance insights
    if (stats.performanceStats.averageGrade > 90) {
      insights.push({
        type: 'positive',
        category: 'performance',
        title: 'Excellent Academic Performance',
        description: `Maintaining an average of ${stats.performanceStats.averageGrade}%`,
        recommendation: 'Consider taking advanced courses or leadership roles'
      });
    } else if (stats.performanceStats.averageGrade < 60) {
      insights.push({
        type: 'alert',
        category: 'performance',
        title: 'Academic Support Needed',
        description: `Current average of ${stats.performanceStats.averageGrade}% indicates need for support`,
        recommendation: 'Schedule meeting with academic advisor and consider tutoring'
      });
    }

    // Submission patterns
    if (stats.submissionStats.lateSubmissionRate > 30) {
      insights.push({
        type: 'warning',
        category: 'habits',
        title: 'Time Management Concern',
        description: `${stats.submissionStats.lateSubmissionRate}% of submissions are late`,
        recommendation: 'Consider using calendar reminders and breaking large assignments into smaller tasks'
      });
    }

    return insights;
  }

  /**
   * Generate system-wide analytics dashboard
   */
  async getSystemAnalytics() {
    try {
      const [
        userStats,
        courseStats,
        activityStats,
        performanceOverview
      ] = await Promise.all([
        this.getUserStatistics(),
        this.getCourseStatistics(),
        this.getActivityStatistics(),
        this.getPerformanceOverview()
      ]);

      return {
        generatedAt: new Date(),
        users: userStats,
        courses: courseStats,
        activity: activityStats,
        performance: performanceOverview
      };
    } catch (error) {
      console.error('System analytics generation failed:', error);
      throw error;
    }
  }

  /**
   * Helper methods for system analytics
   */
  async getUserStatistics() {
    const [totalUsers, activeUsers, usersByRole] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ])
    ]);

    return {
      total: totalUsers,
      active: activeUsers,
      byRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
  }

  async getCourseStatistics() {
    const [totalCourses, activeCourses, coursesByDepartment] = await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ status: 'active' }),
      Course.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } }
      ])
    ]);

    return {
      total: totalCourses,
      active: activeCourses,
      byDepartment: coursesByDepartment.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
  }

  async getActivityStatistics() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [recentSubmissions, recentGrades] = await Promise.all([
      Submission.countDocuments({ submittedAt: { $gte: weekAgo } }),
      Grade.countDocuments({ gradedAt: { $gte: weekAgo } })
    ]);

    return {
      recentSubmissions,
      recentGrades,
      period: '7 days'
    };
  }

  async getPerformanceOverview() {
    const grades = await Grade.find({
      gradedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    if (grades.length === 0) {
      return { systemAverage: 0, totalGrades: 0 };
    }

    const systemAverage = grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length;

    return {
      systemAverage: parseFloat(systemAverage.toFixed(2)),
      totalGrades: grades.length
    };
  }
}

module.exports = new AnalyticsService();
