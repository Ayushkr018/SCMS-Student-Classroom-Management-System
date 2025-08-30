/**
 * Real-time Collaboration Socket Handlers
 */

const logger = require('../utils/logger');

module.exports = (io) => {
  const collaborationNamespace = io.of('/collaboration');

  collaborationNamespace.on('connection', (socket) => {
    logger.info(`Collaboration connection: ${socket.userId}`);

    // Join document collaboration
    socket.on('join-document', async (documentId) => {
      try {
        socket.join(`document:${documentId}`);
        socket.currentDocument = documentId;
        
        // Notify others of user joining
        socket.to(`document:${documentId}`).emit('user-joined-document', {
          userId: socket.userId,
          userName: socket.userName,
          timestamp: new Date()
        });

        // Send current collaborators
        const room = collaborationNamespace.adapter.rooms.get(`document:${documentId}`);
        const collaborators = Array.from(room || []).length;
        
        collaborationNamespace.to(`document:${documentId}`).emit('collaborators-update', {
          count: collaborators
        });

      } catch (error) {
        logger.error('Failed to join document collaboration:', error);
        socket.emit('error', { message: 'Failed to join collaboration' });
      }
    });

    // Real-time text changes
    socket.on('text-change', (changeData) => {
      if (socket.currentDocument) {
        socket.to(`document:${socket.currentDocument}`).emit('text-changed', {
          ...changeData,
          userId: socket.userId,
          userName: socket.userName,
          timestamp: new Date()
        });
      }
    });

    // Cursor position updates
    socket.on('cursor-move', (cursorData) => {
      if (socket.currentDocument) {
        socket.to(`document:${socket.currentDocument}`).emit('cursor-moved', {
          ...cursorData,
          userId: socket.userId,
          userName: socket.userName
        });
      }
    });

    // Selection updates
    socket.on('selection-change', (selectionData) => {
      if (socket.currentDocument) {
        socket.to(`document:${socket.currentDocument}`).emit('selection-changed', {
          ...selectionData,
          userId: socket.userId,
          userName: socket.userName
        });
      }
    });

    // Comment on document
    socket.on('add-comment', async (commentData) => {
      try {
        const comment = {
          id: `comment_${Date.now()}`,
          content: commentData.content,
          position: commentData.position,
          author: {
            id: socket.userId,
            name: socket.userName
          },
          timestamp: new Date(),
          replies: []
        };

        collaborationNamespace.to(`document:${socket.currentDocument}`).emit('comment-added', {
          comment,
          documentId: socket.currentDocument
        });

      } catch (error) {
        logger.error('Failed to add comment:', error);
        socket.emit('error', { message: 'Failed to add comment' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.currentDocument) {
        socket.to(`document:${socket.currentDocument}`).emit('user-left-document', {
          userId: socket.userId,
          userName: socket.userName,
          timestamp: new Date()
        });

        // Update collaborators count
        const room = collaborationNamespace.adapter.rooms.get(`document:${socket.currentDocument}`);
        const collaborators = Array.from(room || []).length;
        
        collaborationNamespace.to(`document:${socket.currentDocument}`).emit('collaborators-update', {
          count: collaborators
        });
      }
    });
  });
};
