PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reading_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`bookId` integer NOT NULL,
	`rating` real NOT NULL,
	`review` text,
	`tags` text,
	`finishedDate` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reading_records`("id", "userId", "bookId", "rating", "review", "tags", "finishedDate", "createdAt", "updatedAt") SELECT "id", "userId", "bookId", "rating", "review", "tags", "finishedDate", "createdAt", "updatedAt" FROM `reading_records`;--> statement-breakpoint
DROP TABLE `reading_records`;--> statement-breakpoint
ALTER TABLE `__new_reading_records` RENAME TO `reading_records`;--> statement-breakpoint
PRAGMA foreign_keys=ON;