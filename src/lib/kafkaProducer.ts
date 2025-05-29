import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "paperloom-app",
  brokers: [process.env.KAFKA_BROKER!],
});

const producer: Producer = kafka.producer();

export const sendMessage = async (topic: string, message: string) => {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [
        {
          value: message,
        },
      ],
    });
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    await producer.disconnect();
  }
};
