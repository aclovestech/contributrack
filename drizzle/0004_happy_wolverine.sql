ALTER TABLE "donors" DROP CONSTRAINT "donors_name_unique";--> statement-breakpoint
ALTER TABLE "donors" ADD CONSTRAINT "donor_name_unique_per_user" UNIQUE("name","user_id");