// import amqp from 'amqplib';

// class RabbitMQConnection {
//   constructor() {
//     this.connection = null;
//     this.channel = null;
//     this.isConnected = false;
//   }

//   async connect() {
//     try {
//       this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
//       this.channel = await this.connection.createChannel();
//       this.isConnected = true;

//       console.log('✅ Connected to RabbitMQ');

//       // Handle connection close
//       this.connection.on('close', () => {
//         console.log('❌ RabbitMQ connection closed');
//         this.isConnected = false;
//         // Implement reconnection logic here if needed
//       });

//       return this.channel;
//     } catch (error) {
//       console.error('❌ Failed to connect to RabbitMQ:', error);
//       throw error;
//     }
//   }

//   async getChannel() {
//     if (!this.isConnected || !this.channel) {
//       await this.connect();
//     }
//     return this.channel;
//   }

//   async close() {
//     if (this.channel) await this.channel.close();
//     if (this.connection) await this.connection.close();
//   }
// }

// // Create singleton instance
// const rabbitMQ = new RabbitMQConnection();

// // Export exchanges and queue names as constants
// export const EXCHANGES = {
//   SCHOOL: 'school_exchange',
//   USER: 'user_exchange',
//   MEAL: 'meal_exchange',
//   NOTIFICATION: 'notification_exchange',
//   CONTENT:'content_exchange',
//   ADMIN:'admin_exchange',
//   VENDOR:'vendor_exchange',
//   ORDER:'order_exchange',
//   HEADER:'Header_exchange',
//   FOOTER:'Footer_exchange',
// };

// export const QUEUES = {
//   SCHOOL_EVENTS: 'school_events_queue',
//   USER_EVENTS: 'user_events_queue',
//   MEAL_EVENTS: 'meal_events_queue',
//   NOTIFICATION_EVENTS: 'notification_events_queue',
//   CONTENT_EVENTS:'content_events_queue',
//   ADMIN_EVENTS:'admin_events_queue',
//   VENDOR_EVENTS:'vendor_events_queue',
//   ORDER_EVENTS:'order_events_queue',
//   HEADER_EVENTS:'header_events_queue',
//   FOOTER_EVENTS:'footer_events_queue',
// };

// export { rabbitMQ };



// -------------------------config with reconnect logic with heartbeat---------------------------------


import amqp from 'amqplib';

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
    this.reconnectTimeout = 5000; // 5 seconds
    this.url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.url, {
        heartbeat: 30, // keep connection alive
      });

      this.connection.on('error', (err) => {
        console.error('🐛 RabbitMQ connection error:', err.message);
      });

      this.connection.on('close', () => {
        console.warn('⚠️ RabbitMQ connection closed! Reconnecting in 5s...');
        this.isConnected = false;
        setTimeout(() => this.reconnect(), this.reconnectTimeout);
      });

      this.channel = await this.connection.createChannel();
      this.isConnected = true;

      console.log('✅ Connected to RabbitMQ');
      return this.channel;

    } catch (error) {
      console.error('❌ RabbitMQ connection failed:', error.message);
      this.isConnected = false;
      setTimeout(() => this.reconnect(), this.reconnectTimeout);
    }
  }

  async reconnect() {
    console.log('🔄 Attempting RabbitMQ reconnection...');
    await this.connect();
  }

  async getChannel() {
    if (!this.isConnected || !this.channel) {
      console.log('⚙️ Reconnecting to RabbitMQ...');
      await this.connect();
    }
    return this.channel;
  }

  async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      this.isConnected = false;
    } catch (err) {
      console.error('⚠️ Error closing RabbitMQ connection:', err.message);
    }
  }
}

const rabbitMQ = new RabbitMQConnection();

export const EXCHANGES = {
  SCHOOL: 'school_exchange',
  USER: 'user_exchange',
  MEAL: 'meal_exchange',
  NOTIFICATION: 'notification_exchange',
  CONTENT: 'content_exchange',
  ADMIN: 'admin_exchange',
  VENDOR: 'vendor_exchange',
  ORDER: 'order_exchange',
  HEADER: 'header_exchange',
  FOOTER: 'footer_exchange',
};

export const QUEUES = {
  SCHOOL_EVENTS: 'school_events_queue',
  USER_EVENTS: 'user_events_queue',
  MEAL_EVENTS: 'meal_events_queue',
  NOTIFICATION_EVENTS: 'notification_events_queue',
  CONTENT_EVENTS: 'content_events_queue',
  ADMIN_EVENTS: 'admin_events_queue',
  VENDOR_EVENTS: 'vendor_events_queue',
  ORDER_EVENTS: 'order_events_queue',
  HEADER_EVENTS: 'header_events_queue',
  FOOTER_EVENTS: 'footer_events_queue',
};

export { rabbitMQ };
