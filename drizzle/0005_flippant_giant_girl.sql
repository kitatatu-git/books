ALTER TABLE `reading_records` ADD `userId` integer NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `users` ADD `password` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_name_unique` ON `users` (`name`);