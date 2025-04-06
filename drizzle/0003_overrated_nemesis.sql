ALTER TABLE "donations" ALTER COLUMN "donor_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "donations" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "donations" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "donors" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "donors" ALTER COLUMN "created_at" DROP NOT NULL;