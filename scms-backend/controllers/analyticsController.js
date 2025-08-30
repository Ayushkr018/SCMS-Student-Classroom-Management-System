// analytics/analyticsController.js
const { PrismaClient } = require('@prisma/client');
const { subDays, format, parseISO } = require('date-fns');

class AnalyticsController {
    constructor() {
        this.prisma = new PrismaClient();
    }

    // Dashboard analytics
    async getDashboardStats(req, res) {
        try {
            const { period = '30d' } = req.query;
            const days = parseInt(period.replace('d', ''));
            const startDate = subDays(new Date(), days);

            // Parallel queries for better performance
            const [
                totalUsers,
                activeClasses,
                attendanceStats,
                resourceStats,
                recentActivity
            ] = await Promise.all([
                this.getTotalUsers(),
                this.getActiveClasses(),
                this.getAttendanceStats(startDate),
                this.getResourceStats(),
                this.getRecentActivity(10)
            ]);

            res.json({
                period,
                stats: {
                    totalUsers,
                    activeClasses,
                    attendance: attendanceStats,
                    resources: resourceStats
                },
                recentActivity,
                generatedAt: new Date().toISOString()
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Attendance analytics
    async getAttendanceAnalytics(req, res) {
        try {
            const { classId, departmentId, startDate, endDate } = req.query;
            
            let whereClause = {};
            if (classId) whereClause.class_id = classId;
            if (startDate && endDate) {
                whereClause.session_date = {
                    gte: parseISO(startDate),
                    lte: parseISO(endDate)
                };
            }

            // Daily attendance trends
            const dailyAttendance = await this.prisma.$queryRaw`
                SELECT 
                    session_date,
                    COUNT(*) as total_sessions,
                    COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
                    COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
                    COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count,
                    ROUND(
                        (COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*)), 2
                    ) as attendance_rate
                FROM attendance 
                WHERE session_date >= ${startDate} AND session_date <= ${endDate}
                ${classId ? 'AND class_id = ' + classId : ''}
                GROUP BY session_date 
                ORDER BY session_date
            `;

            // Attendance by method
            const attendanceByMethod = await this.prisma.attendance.groupBy({
                by: ['method'],
                where: whereClause,
                _count: { method: true },
                _avg: { 
                    _count: true 
                }
            });

            // Class-wise attendance
            const classAttendance = await this.prisma.$queryRaw`
                SELECT 
                    c.name as class_name,
                    c.code as class_code,
                    COUNT(*) as total_sessions,
                    COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
                    ROUND(
                        (COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / COUNT(*)), 2
                    ) as attendance_rate,
                    u.first_name || ' ' || u.last_name as teacher_name
                FROM attendance a
                JOIN classes c ON a.class_id = c.id
                JOIN users u ON c.teacher_id = u.id
                WHERE a.session_date >= ${startDate} AND a.session_date <= ${endDate}
                GROUP BY c.id, c.name, c.code, u.first_name, u.last_name
                ORDER BY attendance_rate DESC
            `;

            // Top performing students
            const topStudents = await this.prisma.$queryRaw`
                SELECT 
                    u.first_name || ' ' || u.last_name as student_name,
                    u.email,
                    COUNT(*) as total_classes,
                    COUNT(CASE WHEN a.status = 'present' THEN 1 END) as classes_attended,
                    ROUND(
                        (COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / COUNT(*)), 2
                    ) as attendance_rate
                FROM attendance a
                JOIN users u ON a.student_id = u.id
                WHERE a.session_date >= ${startDate} AND a.session_date <= ${endDate}
                AND u.role = 'student'
                GROUP BY u.id, u.first_name, u.last_name, u.email
                HAVING COUNT(*) >= 5
                ORDER BY attendance_rate DESC
                LIMIT 10
            `;

            res.json({
                period: { startDate, endDate },
                analytics: {
                    dailyTrends: dailyAttendance,
                    methodBreakdown: attendanceByMethod,
                    classwiseAttendance: classAttendance,
                    topStudents
                },
                summary: {
                    totalSessions: dailyAttendance.reduce((sum, day) => sum + day.total_sessions, 0),
                    averageAttendanceRate: (
                        dailyAttendance.reduce((sum, day) => sum + parseFloat(day.attendance_rate), 0) / 
                        dailyAttendance.length
                    ).toFixed(2)
                }
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Resource utilization analytics
    async getResourceAnalytics(req, res) {
        try {
            const { period = '30d', resourceType } = req.query;
            const days = parseInt(period.replace('d', ''));
            const startDate = subDays(new Date(), days);

            let whereClause = {
                start_time: { gte: startDate },
                status: { in: ['confirmed', 'completed'] }
            };

            if (resourceType) {
                whereClause.resource = { type: resourceType };
            }

            // Resource utilization by type
            const utilizationByType = await this.prisma.resource_bookings.groupBy({
                by: ['resource'],
                where: whereClause,
                _count: { id: true },
                _sum: { 
                    duration_hours: true 
                }
            });

            // Most booked resources
            const mostBookedResources = await this.prisma.$queryRaw`
                SELECT 
                    r.name,
                    r.type,
                    r.location,
                    COUNT(rb.id) as booking_count,
                    SUM(EXTRACT(EPOCH FROM (rb.end_time - rb.start_time))/3600) as total_hours,
                    AVG(EXTRACT(EPOCH FROM (rb.end_time - rb.start_time))/3600) as avg_booking_duration
                FROM resources r
                LEFT JOIN resource_bookings rb ON r.id = rb.resource_id
                WHERE rb.start_time >= ${startDate}
                AND rb.status IN ('confirmed', 'completed')
                GROUP BY r.id, r.name, r.type, r.location
                ORDER BY booking_count DESC
                LIMIT 10
            `;

            // Peak usage hours
            const peakUsageHours = await this.prisma.$queryRaw`
                SELECT 
                    EXTRACT(HOUR FROM start_time) as hour,
                    COUNT(*) as booking_count
                FROM resource_bookings
                WHERE start_time >= ${startDate}
                AND status IN ('confirmed', 'completed')
                GROUP BY EXTRACT(HOUR FROM start_time)
                ORDER BY hour
            `;

            // Department-wise usage
            const departmentUsage = await this.prisma.$queryRaw`
                SELECT 
                    d.name as department_name,
                    COUNT(rb.id) as booking_count,
                    SUM(EXTRACT(EPOCH FROM (rb.end_time - rb.start_time))/3600) as total_hours
                FROM departments d
                JOIN users u ON d.id = u.department_id
                JOIN resource_bookings rb ON u.id = rb.user_id
                WHERE rb.start_time >= ${startDate}
                AND rb.status IN ('confirmed', 'completed')
                GROUP BY d.id, d.name
                ORDER BY booking_count DESC
            `;

            res.json({
                period: `${days} days`,
                analytics: {
                    utilizationByType,
                    mostBookedResources,
                    peakUsageHours,
                    departmentUsage
                }
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // System performance analytics
    async getSystemAnalytics(req, res) {
        try {
            const { period = '7d' } = req.query;
            const days = parseInt(period.replace('d', ''));
            const startDate = subDays(new Date(), days);

            // User activity trends
            const userActivity = await this.prisma.$queryRaw`
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as login_count,
                    COUNT(DISTINCT user_id) as unique_users
                FROM user_sessions
                WHERE created_at >= ${startDate}
                GROUP BY DATE(created_at)
                ORDER BY date
            `;

            // Alert trends
            const alertTrends = await this.prisma.alerts.groupBy({
                by: ['type', 'severity'],
                where: {
                    created_at: { gte: startDate }
                },
                _count: { id: true }
            });

            // System uptime
            const systemUptime = await this.calculateSystemUptime(startDate);

            // Performance metrics
            const performanceMetrics = {
                avgResponseTime: 120, // ms - would come from monitoring
                errorRate: 0.02, // 2% - would come from monitoring
                throughput: 1250, // requests/hour - would come from monitoring
                uptime: systemUptime
            };

            res.json({
                period: `${days} days`,
                analytics: {
                    userActivity,
                    alertTrends,
                    performanceMetrics
                }
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Generate custom reports
    async generateCustomReport(req, res) {
        try {
            const { 
                reportType, 
                startDate, 
                endDate, 
                filters = {},
                format: outputFormat = 'json'
            } = req.body;

            let reportData;

            switch (reportType) {
                case 'attendance_detailed':
                    reportData = await this.generateAttendanceReport(startDate, endDate, filters);
                    break;
                case 'resource_utilization':
                    reportData = await this.generateResourceReport(startDate, endDate, filters);
                    break;
                case 'student_performance':
                    reportData = await this.generateStudentReport(startDate, endDate, filters);
                    break;
                case 'system_usage':
                    reportData = await this.generateSystemReport(startDate, endDate, filters);
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid report type' });
            }

            // Format output
            if (outputFormat === 'csv') {
                const csv = this.convertToCSV(reportData);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=${reportType}_${Date.now()}.csv`);
                return res.send(csv);
            }

            res.json({
                reportType,
                period: { startDate, endDate },
                filters,
                data: reportData,
                generatedAt: new Date().toISOString()
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Helper methods
    async getTotalUsers() {
        const counts = await this.prisma.users.groupBy({
            by: ['role'],
            where: { is_active: true },
            _count: { id: true }
        });
        
        return counts.reduce((acc, curr) => {
            acc[curr.role] = curr._count.id;
            acc.total = (acc.total || 0) + curr._count.id;
            return acc;
        }, {});
    }

    async getActiveClasses() {
        const today = new Date();
        const todayStr = format(today, 'yyyy-MM-dd');
        
        return await this.prisma.classes.count({
            where: {
                is_active: true,
                attendance: {
                    some: {
                        session_date: todayStr
                    }
                }
            }
        });
    }

    async getAttendanceStats(startDate) {
        const stats = await this.prisma.attendance.groupBy({
            by: ['status'],
            where: {
                session_date: { gte: startDate }
            },
            _count: { status: true }
        });

        const total = stats.reduce((sum, stat) => sum + stat._count.status, 0);
        const present = stats.find(s => s.status === 'present')?._count.status || 0;
        
        return {
            total,
            present,
            absent: stats.find(s => s.status === 'absent')?._count.status || 0,
            late: stats.find(s => s.status === 'late')?._count.status || 0,
            attendanceRate: total > 0 ? ((present / total) * 100).toFixed(2) : 0
        };
    }

    async getResourceStats() {
        const stats = await this.prisma.resources.groupBy({
            by: ['status'],
            _count: { status: true }
        });

        const total = stats.reduce((sum, stat) => sum + stat._count.status, 0);
        
        return {
            total,
            available: stats.find(s => s.status === 'available')?._count.status || 0,
            booked: stats.find(s => s.status === 'booked')?._count.status || 0,
            maintenance: stats.find(s => s.status === 'maintenance')?._count.status || 0
        };
    }

    async getRecentActivity(limit = 10) {
        // This would come from an activity log table
        return [
            { type: 'attendance', message: 'CS101 class attendance marked', timestamp: new Date() },
            { type: 'booking', message: 'Projector A booked for Room 201', timestamp: new Date() },
            { type: 'alert', message: 'Temperature sensor offline', timestamp: new Date() }
        ];
    }

    async calculateSystemUptime(startDate) {
        // This would calculate from monitoring data
        return 99.8; // percentage
    }

    convertToCSV(data) {
        if (!Array.isArray(data) || data.length === 0) return '';
        
        const headers = Object.keys(data);
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }
}

module.exports = new AnalyticsController();
