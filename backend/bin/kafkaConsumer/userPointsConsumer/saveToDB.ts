import { Message } from "./interfaces"
import {
  Prisma,
  ExerciseCompletion,
  Exercise,
  User,
} from "../../../generated/prisma-client"
import TmcClient from "../../../services/tmc"
import { DateTime } from "luxon"
import winston = require("winston")
import { CheckCompletion } from "../userCourseProgressConsumer/generateUserCourseProgress"
import * as knex from "knex"

const Knex = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  searchPath:
    process.env.NODE_ENV === "production"
      ? ["moocfi$production"]
      : ["default$default"],
})

const isUserInDB = async (user_id: number) => {
  return await Knex("user").where("upstream_id", "=", user_id)
}

const getUserFromTMC = async (
  prisma: Prisma,
  user_id: number,
): Promise<User> => {
  const tmc: TmcClient = new TmcClient()
  const userDetails = await tmc.getUserDetailsById(user_id)

  return prisma.createUser({
    upstream_id: userDetails.id,
    first_name: userDetails.user_field.first_name,
    last_name: userDetails.user_field.last_name,
    email: userDetails.email,
    username: userDetails.username,
    administrator: userDetails.administrator,
  })
}

export const saveToDatabase = async (
  message: Message,
  prisma: Prisma,
  logger: winston.Logger,
): Promise<Boolean> => {
  console.log("Parsing timestamp")
  const timestamp: DateTime = DateTime.fromISO(message.timestamp)

  console.log(`Checking if user ${message.user_id} exists.`)

  let user: User | null

  user = (await Knex("user").where("upstream_id", message.user_id).limit(1))[0]

  if (!user) {
    try {
      user = await getUserFromTMC(prisma, message.user_id)
    } catch (e) {
      user = (
        await Knex("user").where("upstream_id", message.user_id).limit(1)
      )[0]
      if (!user) {
        throw e
      }
      console.log("Mitigated race condition with user imports")
    }
  }

  const course = await prisma.course({
    id: message.course_id,
  })

  if (!user || !course) {
    logger.error("Invalid user or course")
    return false
  }

  logger.info("Checking if a exercise exists with id " + message.exercise_id)
  const isExercise = await prisma.$exists.exercise({
    custom_id: message.exercise_id,
  })
  if (!isExercise) {
    logger.error("Given exercise does not exist")
    return false
  }
  logger.info("Getting the exercise")
  const exercises: Exercise[] = await prisma.exercises({
    first: 1,
    where: {
      custom_id: message.exercise_id,
    },
  })

  const exercise = exercises[0]

  logger.info("Getting the completion")
  const exerciseCompleteds: ExerciseCompletion[] = await prisma.exerciseCompletions(
    {
      first: 1,
      where: {
        exercise: { custom_id: message.exercise_id },
        user: { upstream_id: Number(message.user_id) },
      },
      orderBy: "timestamp_DESC",
    },
  )
  const exerciseCompleted = exerciseCompleteds[0]
  let savedExerciseCompletion: ExerciseCompletion
  if (!exerciseCompleted) {
    logger.info("No previous completion, creating a new one")
    savedExerciseCompletion = await prisma.createExerciseCompletion({
      exercise: { connect: { id: exercise.id } },
      user: { connect: { upstream_id: Number(message.user_id) } },
      n_points: message.n_points,
      completed: message.completed,
      required_actions: {
        create: message.required_actions.map((ra) => {
          return {
            value: ra,
          }
        }),
      },
      timestamp: message.timestamp,
    })
  } else {
    logger.info("Updating previous completion")
    const oldTimestamp = DateTime.fromISO(exerciseCompleted.timestamp ?? "")
    if (timestamp <= oldTimestamp) {
      logger.error("Timestamp older than in DB, aborting")
      return false
    }
    savedExerciseCompletion = await prisma.updateExerciseCompletion({
      where: { id: exerciseCompleted.id },
      data: {
        n_points: Number(message.n_points),
        completed: message.completed,
        required_actions: {
          create: message.required_actions.map((ra) => {
            return {
              value: ra,
            }
          }),
        },
        timestamp: message.timestamp,
      },
    })
  }
  await CheckCompletion(user, course)
  logger.info("Saved to DB succesfully")
  return true
}
