import { Prisma, PrismaClient, Driver_Profile, Passenger_Profile, Users, Car, Trip} from "@prisma/client";

const prisma = new PrismaClient()

export { prisma, Prisma, Users, Car, Driver_Profile, Passenger_Profile, Trip };