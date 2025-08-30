const {
    User,
    Course,
    Grade,
    Submission,
    Session,
    Notification,
    Audit
} = require('../models');
const {
    subDays
} = require('date-fns');
const {
    mongoose
} = require('mongoose');

class AnalyticsController {

    // Dashboard analytics
    async getDashboardStats(req, res) {
        try {
            const {
                period = '30d'
            } = req.query;
            const days = parseInt(period.replace('d', ''));
            const startDate = subDays(new Date(), days);

            // Parallel queries for better performance
            const [
                userStats,
                activeCourses,
                submissionStats,
                recentActivity
            ] = await Promise.all([
                this.getUserStats(),
                this.getActiveCourses(),
                this.getSubmissionStats(startDate),
                this.getRecentActivity(10)
            ]);

            res.json({
                period: `${days} days`,
                stats: {
                    users: userStats,
                    activeCourses,
                    submissions: submissionStats,
                },
                recentActivity,
                generatedAt: new Date().toISOString()
            });

        } catch (error) {
            console.error("Dashboard Stats Error:", error);
            res.status(500).json({
                error: 'Failed to retrieve dashboard statistics.'
            });
        }
    }

    // Course-specific analytics
    async getCourseAnalytics(req, res) {
        try {
            const {
                courseId
            } = req.params;
            const {
                period = '90d'
            } = req.query;
            const days = parseInt(period.replace('d', ''));
            const startDate = subDays(new Date(), days);

            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                return res.status(400).json({
                    error: 'Invalid Course ID format'
                });
            }
            const courseObjectId = new mongoose.Types.ObjectId(courseId);

            const [
                submissionTrends,
                averageScores,
                topStudents,
                passFailRate
            ] = await Promise.all([
                this.getSubmissionTrends(courseObjectId, startDate),
                this.getAverageScores(courseObjectId, startDate),
                this.getTopPerformingStudents(courseObjectId, 5),
                this.getPassFailRate(courseObjectId)
            ]);

            res.json({
                courseId,
                period: `${days} days`,
                analytics: {
                    submissionTrends,
                    averageScores,
                    topStudents,
                    passFailRate
                },
                generatedAt: new Date().toISOString()
            });

        } catch (error) {
            console.error(`Course Analytics Error for ${req.params.courseId}:`, error);
            res.status(500).json({
                error: 'Failed to retrieve course analytics.'
            });
        }
    }

    // System performance analytics
    async getSystemAnalytics(req, res) {
        try {
            const {
                period = '7d'
            } = req.query;
            const days = parseInt(period.replace('d', ''));
            const startDate = subDays(new Date(), days);

            const [
                userActivity,
                notificationTrends,
            ] = await Promise.all([
                this.getUserActivity(startDate),
                this.getNotificationTrends(startDate),
            ]);


            // Mocked data as this would come from external monitoring
            const performanceMetrics = {
                avgResponseTime: 110, // ms
                errorRate: 0.015, // 1.5%
                uptime: 99.95, // percentage
            };

            res.json({
                period: `${days} days`,
                analytics: {
                    userActivity,
                    notificationTrends,
                    performanceMetrics
                },
                generatedAt: new Date().toISOString()
            });

        } catch (error) {
            console.error("System Analytics Error:", error);
            res.status(500).json({
                error: 'Failed to retrieve system analytics.'
            });
        }
    }


    // Helper methods using Mongoose
    async getUserStats() {
        const stats = await User.aggregate([{
            $match: {
                status: 'active'
            }
        }, {
            $group: {
                _id: "$role",
                count: {
                    $sum: 1
                }
            }
        }, ]);
        const userStats = stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});
        userStats.total = stats.reduce((sum, curr) => sum + curr.count, 0);
        return userStats;
    }

    async getActiveCourses() {
        return Course.countDocuments({
            status: 'active'
        });
    }

    async getSubmissionStats(startDate) {
        const stats = await Submission.aggregate([{
            $match: {
                submittedAt: {
                    $gte: startDate
                }
            }
        }, {
            $group: {
                _id: null,
                total: {
                    $sum: 1
                },
                onTime: {
                    $sum: {
                        $cond: [{
                            $eq: ["$isLate", false]
                        }, 1, 0]
                    }
                },
                late: {
                    $sum: {
                        $cond: [{
                            $eq: ["$isLate", true]
                        }, 1, 0]
                    }
                },
            }
        }]);

        if (stats.length === 0) {
            return {
                total: 0,
                onTime: 0,
                late: 0,
                onTimeRate: 0
            };
        }
        const {
            total,
            onTime,
            late
        } = stats[0];
        return {
            total,
            onTime,
            late,
            onTimeRate: total > 0 ? ((onTime / total) * 100).toFixed(2) : 0
        };
    }

    async getRecentActivity(limit = 10) {
        return Audit.find().sort({
            createdAt: -1
        }).limit(limit).populate('userId', 'firstName lastName email');
    }

    async getSubmissionTrends(courseObjectId, startDate) {
        return Submission.aggregate([{
            $match: {
                assignmentId: {
                    $in: await mongoose.model('Assignment').find({
                        courseId: courseObjectId
                    }).distinct('_id')
                },
                createdAt: {
                    $gte: startDate
                }
            }
        }, {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                count: {
                    $sum: 1
                }
            }
        }, {
            $sort: {
                _id: 1
            }
        }]);
    }

    async getAverageScores(courseObjectId, startDate) {
        return Grade.aggregate([{
            $match: {
                courseId: courseObjectId,
                createdAt: {
                    $gte: startDate
                }
            }
        }, {
            $group: {
                _id: "$assessmentType",
                averagePercentage: {
                    $avg: "$percentage"
                }
            }
        }]);
    }

    async getTopPerformingStudents(courseObjectId, limit = 5) {
        return Grade.aggregate([{
            $match: {
                courseId: courseObjectId
            }
        }, {
            $group: {
                _id: "$studentId",
                averageScore: {
                    $avg: "$percentage"
                }
            }
        }, {
            $sort: {
                averageScore: -1
            }
        }, {
            $limit: limit
        }, {
            $lookup: {
                from: 'students',
                localField: '_id',
                foreignField: '_id',
                as: 'studentInfo'
            }
        }, {
            $unwind: '$studentInfo'
        }, {
            $lookup: {
                from: 'users',
                localField: 'studentInfo.userId',
                foreignField: '_id',
                as: 'userInfo'
            }
        }, {
            $unwind: '$userInfo'
        }, {
            $project: {
                _id: 0,
                studentId: '$_id',
                name: {
                    $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName']
                },
                rollNumber: '$studentInfo.rollNumber',
                averageScore: {
                    $round: ['$averageScore', 2]
                }
            }
        }]);
    }

    async getPassFailRate(courseObjectId) {
        const stats = await Grade.aggregate([{
            $match: {
                courseId: courseObjectId
            }
        }, {
            $group: {
                _id: null,
                total: {
                    $sum: 1
                },
                passing: {
                    $sum: {
                        $cond: [{
                            $gte: ["$percentage", 40]
                        }, 1, 0]
                    }
                } // Assuming 40% is passing
            }
        }]);
        if (stats.length === 0) return {
            passRate: 0,
            failRate: 0
        };
        const {
            total,
            passing
        } = stats[0];
        return {
            passRate: total > 0 ? ((passing / total) * 100).toFixed(2) : 0,
            failRate: total > 0 ? (((total - passing) / total) * 100).toFixed(2) : 0,
        };
    }

    async getUserActivity(startDate) {
        return Session.aggregate([{
            $match: {
                createdAt: {
                    $gte: startDate
                }
            }
        }, {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                loginCount: {
                    $sum: 1
                },
                uniqueUsers: {
                    $addToSet: "$userId"
                }
            }
        }, {
            $project: {
                date: "$_id",
                loginCount: 1,
                uniqueUserCount: {
                    $size: "$uniqueUsers"
                },
                _id: 0
            }
        }, {
            $sort: {
                date: 1
            }
        }]);
    }

    async getNotificationTrends(startDate) {
        return Notification.aggregate([{
            $match: {
                createdAt: {
                    $gte: startDate
                }
            }
        }, {
            $group: {
                _id: "$type",
                count: {
                    $sum: 1
                }
            }
        }]);
    }
}

module.exports = new AnalyticsController();
