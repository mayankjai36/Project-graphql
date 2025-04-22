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

      const raw = await fetchSearchMetrics(siteUrl, startDate, endDate);

      const cleaned = raw
        .filter(
          (
            row
          ): row is {
            date: string;
            page: string;
            clicks: number | null | undefined;
            impressions: number | null | undefined;
            ctr: number | null | undefined;
            position: number | null | undefined;
          } => !!row.date && !!row.page
        )
        .map((row) => ({
          date: row.date,
          page: row.page,
          clicks: row.clicks ?? 0,
          impressions: row.impressions ?? 0,
          ctr: row.ctr ?? 0,
          position: row.position ?? 0,
        }));

      await upsertMetrics(cleaned);
      ch.ack(msg);
    } catch (err) {
      console.error('Failed to process job:', err);
      ch.nack(msg, false, false);
    }
  });
})();
