ALTER TABLE "donations" ALTER COLUMN "date_received" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "donors" ADD CONSTRAINT "donors_name_unique" UNIQUE("name");