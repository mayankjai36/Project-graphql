import amqplib from 'amqplib';
import fs from 'fs';
import { RABBITMQ_URL, RABBIT_QUEUE } from '../config/constants';

(async () => {
  const conn = await amqplib.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(RABBIT_QUEUE);
  const { siteUrl } = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));
  ch.sendToQueue(
    RABBIT_QUEUE,
    Buffer.from(
      JSON.stringify({
        siteUrl,
        startDate: '2024-01-01',
        endDate: '2024-04-01',
      })
    )
  );
  console.log('Message sent');
  await ch.close();
  await conn.close();
})();
