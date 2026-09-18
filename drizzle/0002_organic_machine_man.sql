ALTER TABLE "donations" DROP CONSTRAINT "donations_donor_id_donors_id_fk";
--> statement-breakpoint
ALTER TABLE "donations" DROP CONSTRAINT "donations_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "donors" DROP CONSTRAINT "donors_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."donors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donors" ADD CONSTRAINT "donors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;