CREATE TABLE `ShortUrls` (
	`Alias` text PRIMARY KEY NOT NULL,
	`Origin` text NOT NULL,
	`Hits` integer DEFAULT 0 NOT NULL,
	`CreatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`UpdatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `IdxOrigin` ON `ShortUrls` (`Origin`);
