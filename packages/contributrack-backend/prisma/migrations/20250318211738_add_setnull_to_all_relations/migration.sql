/*
  Warnings:

  - Added the required column `updated_at` to the `donations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_donor_id_fkey";

-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "donors" DROP CONSTRAINT "donors_user_id_fkey";

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "donor_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "donors" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "donors" ADD CONSTRAINT "donors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
