import { Kafka, Consumer } from "kafkajs";

const kafka = new Kafka({
  clientId: "paperloom-app",
  brokers: [process.env.KAFKA_BROKER!],
});

const consumer: Consumer = kafka.consumer({ groupId: "paperloom-group" });

export const consumeMessages = async (topic: string) => {
  await consumer.connect();
  await consumer.subscribe({ topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `Message in ${topic} [${partition}]: Received message: ${message.value?.toString()}`
      );
    },
  });
};
