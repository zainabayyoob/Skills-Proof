import { db } from '../db.js';

/**
 * SkillProof Notification Architecture
 * Ready for SMS/WhatsApp provider webhooks (Twilio, Gupshup, Fast2SMS)
 * Records authentic delivery status and in-app event feeds
 */
export const notificationService = {
  /**
   * Dispatches a notification to user across specified channels
   */
  notify: async ({ userId, type = 'INFO', title, message, channels = ['IN_APP'], metadata = {} }) => {
    if (!userId || !title) return null;

    const user = db.getUserById(userId);
    if (!user) return null;

    const results = [];

    for (const ch of channels) {
      const channel = ch.toUpperCase();
      let status = 'DELIVERED';
      let channelNote = null;

      if (channel === 'SMS' || channel === 'SMS_READY') {
        // SMS Gateway integration architecture
        if (user.phone) {
          status = 'QUEUED_FOR_SMS_GATEWAY';
          channelNote = `Ready for SMS dispatch to ${user.phone}`;
        } else {
          status = 'SKIPPED_NO_PHONE';
          channelNote = 'User has no phone number on record';
        }
      } else if (channel === 'WHATSAPP' || channel === 'WHATSAPP_READY') {
        // WhatsApp Business API integration architecture
        if (user.phone) {
          status = 'QUEUED_FOR_WHATSAPP_API';
          channelNote = `Ready for WhatsApp notification template dispatch to ${user.phone}`;
        } else {
          status = 'SKIPPED_NO_PHONE';
          channelNote = 'User has no phone number on record';
        }
      }

      const notifRecord = db.addNotification(userId, {
        type,
        title,
        message,
        channel,
        deliveryStatus: status,
        channelNote,
        metadata
      });

      results.push(notifRecord);
    }

    return results;
  },

  /**
   * Retrieves all notification records for a user
   */
  getUserNotifications: (userId) => {
    return db.getNotificationsByUser(userId);
  }
};
