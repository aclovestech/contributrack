-- CreateEnum
CREATE TYPE "DonationType" AS ENUM ('TITHES', 'OTHER');

-- CreateTable
CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "dateReceived" TIMESTAMP(3) NOT NULL,
    "donorName" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "donationType" "DonationType" NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);
