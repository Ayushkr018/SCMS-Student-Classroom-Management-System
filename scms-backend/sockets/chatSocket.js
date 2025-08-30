/**
 * Real-time Chat Socket Handlers
 */

const logger = require('../utils/logger');
const Message = require('../models/Message');
const Course = require('../models/Course');

module.exports = (io) => {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {
    logger.info(`Chat connection: ${socket.userId}`);

    // Join course chat room
    socket.on('join-course-chat', async (courseId) => {
      try {
        // Verify user has access to course
        const course = await Course.findById(courseId);
        if (!course) {
          socket.emit('error', { message: 'Course not found' });
          return;
        }

        const hasAccess = course.students.includes(socket.userId) || 
                         course.teachers.includes(socket.userId);
        
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied to course chat' });
          return;
        }

        socket.join(`course:${courseId}`);
        socket.currentCourse = courseId;
        
        // Send recent messages
        const recentMessages = await Message.find({
          course: courseId,
          type: 'course'
        })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('sender', 'name role')
        .lean();

        socket.emit('chat-history', {
          messages: recentMessages.reverse(),
          courseId
        });

        // Notify others of user joining
        socket.to(`course:${courseId}`).emit('user-joined-chat', {
          userId: socket.userId,
          userName: socket.userName,
          userRole: socket.userRole
        });

      } catch (error) {
        logger.error('Failed to join course chat:', error);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Send message
    socket.on('send-message', async (messageData) => {
      try {
        const { content, courseId, type = 'text', attachments = [] } = messageData;

        if (!socket.currentCourse || socket.currentCourse !== courseId) {
          socket.emit('error', { message: 'Not joined to course chat' });
          return;
        }

        // Create message
        const message = await Message.create({
          content,
          sender: socket.userId,
          course: courseId,
          type: 'course',
          messageType: type,
          attachments,
          timestamp: new Date()
        });

        await message.populate('sender', 'name role');

        // Broadcast to course chat
        chatNamespace.to(`course:${courseId}`).emit('new-message', {
          message: message.toObject(),
          courseId
        });

        logger.info(`Message sent in course ${courseId} by user ${socket.userId}`);

      } catch (error) {
        logger.error('Failed to send message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Private message
    socket.on('send-private-message', async (messageData) => {
      try {
        const { content, recipientId, type = 'text' } = messageData;

        const message = await Message.create({
          content,
          sender: socket.userId,
          recipient: recipientId,
          type: 'private',
          messageType: type,
          timestamp: new Date()
        });

        await message.populate('sender', 'name role');

        // Send to recipient
        chatNamespace.to(`user:${recipientId}`).emit('private-message', {
          message: message.toObject()
        });

        // Confirm to sender
        socket.emit('message-sent', {
          messageId: message._id,
          timestamp: message.timestamp
        });

      } catch (error) {
        logger.error('Failed to send private message:', error);
        socket.emit('error', { message: 'Failed to send private message' });
      }
    });

    // Typing indicator
    socket.on('typing-start', (courseId) => {
      if (socket.currentCourse === courseId) {
        socket.to(`course:${courseId}`).emit('user-typing', {
          userId: socket.userId,
          userName: socket.userName
        });
      }
    });

    socket.on('typing-stop', (courseId) => {
      if (socket.currentCourse === courseId) {
        socket.to(`course:${courseId}`).emit('user-stop-typing', {
          userId: socket.userId
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.currentCourse) {
        socket.to(`course:${socket.currentCourse}`).emit('user-left-chat', {
          userId: socket.userId,
          userName: socket.userName
        });
      }
    });
  });
};
