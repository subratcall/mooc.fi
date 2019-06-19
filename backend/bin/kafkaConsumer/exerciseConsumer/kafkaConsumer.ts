require("dotenv-safe").config()
import { prisma } from "../../../generated/prisma-client"
import { Mutex } from "await-semaphore"

import * as Kafka from "node-rdkafka"
import * as winston from "winston"

import { handleMessage } from "./handleMessage"

const TOPIC_NAME = ["exercise"]

const mutex = new Mutex()

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "kafka-consumer-exercise" },
  transports: [new winston.transports.Console()],
})

const logCommit = (err, topicPartitions) => {
  if (err) {
    logger.error("Error in commit:" + err)
  } else {
    logger.info("Committed. topicPartitions:" + topicPartitions)
  }
}

const consumer = new Kafka.KafkaConsumer(
  {
    "group.id": "kafka",
    "metadata.broker.list": process.env.KAFKA_HOST,
    offset_commit_cb: logCommit,
    "enable.auto.commit": "false",
    "partition.assignment.strategy": "roundrobin",
  },
  { "auto.offset.reset": "earliest" },
)

consumer.connect()

consumer
  .on("ready", () => {
    consumer.subscribe(TOPIC_NAME)
    consumer.consume()
  })
  .on("data", message =>
    handleMessage(message, mutex, logger, consumer, prisma),
  )
consumer.on("event.error", error => logger.error(error))

consumer.on("event.log", function(log) {
  console.log(log)
})