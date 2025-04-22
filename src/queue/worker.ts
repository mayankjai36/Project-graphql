import amqplib, { ConsumeMessage } from 'amqplib';
import { fetchSearchMetrics } from '../services/google';
import { upsertMetrics } from '../services/metrics';
import { RABBITMQ_URL, RABBIT_QUEUE } from '../config/constants';

(async () => {
  const conn = await amqplib.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(RABBIT_QUEUE);

  ch.consume(RABBIT_QUEUE, async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const { siteUrl, startDate, endDate } = JSON.parse(
        msg.content.toString()
      );
      const data = await fetchSearchMetrics(siteUrl, startDate, endDate);
      await upsertMetrics(data);
      ch.ack(msg);
    } catch (err) {
      console.error('Failed:', err);
      ch.nack(msg, false, false);
    }
  });
})();
