CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`googleBooksId` text NOT NULL,
	`title` text NOT NULL,
	`authors` text,
	`description` text,
	`thumbnail` text,
	`publishedDate` text,
	`pageCount` integer,
	`categories` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `books_googleBooksId_unique` ON `books` (`googleBooksId`);--> statement-breakpoint
CREATE TABLE `reading_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bookId` integer NOT NULL,
	`rating` integer NOT NULL,
	`review` text,
	`finishedDate` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
