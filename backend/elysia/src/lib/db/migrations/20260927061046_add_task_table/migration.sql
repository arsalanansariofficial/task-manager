CREATE TABLE `task` (
  `user_id` text NOT NULL,
  `status` text DEFAULT 'incomplete',
  `title` text NOT NULL,
  `description` text,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae',
  CONSTRAINT `fk_task_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_account` (
  `user_id` text NOT NULL,
  `gender` text,
  `refresh_token_expires_at` text,
  `provider_id` text NOT NULL,
  `access_token_expires_at` text,
  `account_id` text NOT NULL,
  `refresh_token` text,
  `access_token` text,
  `password` text,
  `address` text,
  `id_token` text,
  `cover` text,
  `scope` text,
  `bio` text,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae',
  CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

--> statement-breakpoint
INSERT INTO
  `__new_account` (
    `user_id`,
    `gender`,
    `refresh_token_expires_at`,
    `provider_id`,
    `access_token_expires_at`,
    `account_id`,
    `refresh_token`,
    `access_token`,
    `password`,
    `address`,
    `id_token`,
    `cover`,
    `scope`,
    `bio`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `user_id`,
  `gender`,
  `refresh_token_expires_at`,
  `provider_id`,
  `access_token_expires_at`,
  `account_id`,
  `refresh_token`,
  `access_token`,
  `password`,
  `address`,
  `id_token`,
  `cover`,
  `scope`,
  `bio`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `account`;

--> statement-breakpoint
DROP TABLE `account`;

--> statement-breakpoint
ALTER TABLE `__new_account`
RENAME TO `account`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_invitation` (
  `organization_id` text NOT NULL,
  `inviter_id` text NOT NULL,
  `expires_at` text NOT NULL,
  `status` text NOT NULL,
  `email` text NOT NULL,
  `team_id` text,
  `role` text,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae',
  CONSTRAINT `fk_invitation_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_invitation_inviter_id_user_id_fk` FOREIGN KEY (`inviter_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

--> statement-breakpoint
INSERT INTO
  `__new_invitation` (
    `organization_id`,
    `inviter_id`,
    `expires_at`,
    `status`,
    `email`,
    `team_id`,
    `role`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `organization_id`,
  `inviter_id`,
  `expires_at`,
  `status`,
  `email`,
  `team_id`,
  `role`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `invitation`;

--> statement-breakpoint
DROP TABLE `invitation`;

--> statement-breakpoint
ALTER TABLE `__new_invitation`
RENAME TO `invitation`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_member` (
  `organization_id` text NOT NULL,
  `user_id` text NOT NULL,
  `role` text NOT NULL,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae',
  CONSTRAINT `fk_member_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_member_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

--> statement-breakpoint
INSERT INTO
  `__new_member` (
    `organization_id`,
    `user_id`,
    `role`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `organization_id`,
  `user_id`,
  `role`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `member`;

--> statement-breakpoint
DROP TABLE `member`;

--> statement-breakpoint
ALTER TABLE `__new_member`
RENAME TO `member`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_organization` (
  `slug` text NOT NULL CONSTRAINT `organization_slug_unique_index` UNIQUE,
  `name` text NOT NULL,
  `metadata` text,
  `logo` text,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae'
);

--> statement-breakpoint
INSERT INTO
  `__new_organization` (
    `slug`,
    `name`,
    `metadata`,
    `logo`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `slug`,
  `name`,
  `metadata`,
  `logo`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `organization`;

--> statement-breakpoint
DROP TABLE `organization`;

--> statement-breakpoint
ALTER TABLE `__new_organization`
RENAME TO `organization`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_organization_role` (
  `organization_id` text NOT NULL,
  `permission` text NOT NULL,
  `role` text NOT NULL,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae',
  CONSTRAINT `fk_organization_role_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`) ON DELETE CASCADE
);

--> statement-breakpoint
INSERT INTO
  `__new_organization_role` (
    `organization_id`,
    `permission`,
    `role`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `organization_id`,
  `permission`,
  `role`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `organization_role`;

--> statement-breakpoint
DROP TABLE `organization_role`;

--> statement-breakpoint
ALTER TABLE `__new_organization_role`
RENAME TO `organization_role`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_session` (
  `user_id` text NOT NULL,
  `token` text NOT NULL CONSTRAINT `session_token_unique_index` UNIQUE,
  `active_organization_id` text,
  `expires_at` text NOT NULL,
  `impersonated_by` text,
  `active_team_id` text,
  `ip_address` text,
  `user_agent` text,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae',
  CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

--> statement-breakpoint
INSERT INTO
  `__new_session` (
    `user_id`,
    `token`,
    `active_organization_id`,
    `expires_at`,
    `impersonated_by`,
    `active_team_id`,
    `ip_address`,
    `user_agent`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `user_id`,
  `token`,
  `active_organization_id`,
  `expires_at`,
  `impersonated_by`,
  `active_team_id`,
  `ip_address`,
  `user_agent`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `session`;

--> statement-breakpoint
DROP TABLE `session`;

--> statement-breakpoint
ALTER TABLE `__new_session`
RENAME TO `session`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_team` (
  `organization_id` text NOT NULL,
  `member_count` integer NOT NULL,
  `name` text NOT NULL,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae',
  CONSTRAINT `fk_team_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`) ON DELETE CASCADE
);

--> statement-breakpoint
INSERT INTO
  `__new_team` (
    `organization_id`,
    `member_count`,
    `name`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `organization_id`,
  `member_count`,
  `name`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `team`;

--> statement-breakpoint
DROP TABLE `team`;

--> statement-breakpoint
ALTER TABLE `__new_team`
RENAME TO `team`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_team_member` (
  `user_id` text NOT NULL,
  `team_id` text NOT NULL,
  `membership_key` text,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae',
  CONSTRAINT `fk_team_member_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_team_member_team_id_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE CASCADE
);

--> statement-breakpoint
INSERT INTO
  `__new_team_member` (
    `user_id`,
    `team_id`,
    `membership_key`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `user_id`,
  `team_id`,
  `membership_key`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `team_member`;

--> statement-breakpoint
DROP TABLE `team_member`;

--> statement-breakpoint
ALTER TABLE `__new_team_member`
RENAME TO `team_member`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_two_factor` (
  `user_id` text NOT NULL,
  `verified` integer DEFAULT true,
  `failed_verification_count` integer DEFAULT 0,
  `backup_codes` text NOT NULL,
  `secret` text NOT NULL,
  `locked_until` text,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae',
  CONSTRAINT `fk_two_factor_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

--> statement-breakpoint
INSERT INTO
  `__new_two_factor` (
    `user_id`,
    `verified`,
    `failed_verification_count`,
    `backup_codes`,
    `secret`,
    `locked_until`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `user_id`,
  `verified`,
  `failed_verification_count`,
  `backup_codes`,
  `secret`,
  `locked_until`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `two_factor`;

--> statement-breakpoint
DROP TABLE `two_factor`;

--> statement-breakpoint
ALTER TABLE `__new_two_factor`
RENAME TO `two_factor`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_user` (
  `email_verified` integer DEFAULT false NOT NULL,
  `phone_number` text CONSTRAINT `user_phone_number_unique_index` UNIQUE,
  `email` text NOT NULL CONSTRAINT `user_email_unique_index` UNIQUE,
  `username` text CONSTRAINT `user_username_unique_index` UNIQUE,
  `phone_number_verified` integer,
  `two_factor_enabled` integer,
  `is_anonymous` integer,
  `banned` integer,
  `display_username` text,
  `name` text NOT NULL,
  `ban_reason` text,
  `ban_expires` text,
  `image` text,
  `role` text,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae'
);

--> statement-breakpoint
INSERT INTO
  `__new_user` (
    `email_verified`,
    `phone_number`,
    `email`,
    `username`,
    `phone_number_verified`,
    `two_factor_enabled`,
    `is_anonymous`,
    `banned`,
    `display_username`,
    `name`,
    `ban_reason`,
    `ban_expires`,
    `image`,
    `role`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `email_verified`,
  `phone_number`,
  `email`,
  `username`,
  `phone_number_verified`,
  `two_factor_enabled`,
  `is_anonymous`,
  `banned`,
  `display_username`,
  `name`,
  `ban_reason`,
  `ban_expires`,
  `image`,
  `role`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `user`;

--> statement-breakpoint
DROP TABLE `user`;

--> statement-breakpoint
ALTER TABLE `__new_user`
RENAME TO `user`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_verification` (
  `identifier` text NOT NULL,
  `expires_at` text NOT NULL,
  `value` text NOT NULL,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  `id` text PRIMARY KEY DEFAULT '01a0e17c-c677-74b3-856b-b29a932fd2ae'
);

--> statement-breakpoint
INSERT INTO
  `__new_verification` (
    `identifier`,
    `expires_at`,
    `value`,
    `updated_at`,
    `created_at`,
    `id`
  )
SELECT
  `identifier`,
  `expires_at`,
  `value`,
  `updated_at`,
  `created_at`,
  `id`
FROM
  `verification`;

--> statement-breakpoint
DROP TABLE `verification`;

--> statement-breakpoint
ALTER TABLE `__new_verification`
RENAME TO `verification`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `__new_user_profile` (
  `user_id` text PRIMARY KEY,
  `phone_number` text CONSTRAINT `user_profile_phone_number_unique_index` UNIQUE,
  `gender` text,
  `address` text,
  `cover` text,
  `bio` text,
  `updated_at` text NOT NULL,
  `created_at` text NOT NULL,
  CONSTRAINT `fk_user_profile_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

--> statement-breakpoint
INSERT INTO
  `__new_user_profile` (
    `user_id`,
    `phone_number`,
    `gender`,
    `address`,
    `cover`,
    `bio`,
    `updated_at`,
    `created_at`
  )
SELECT
  `user_id`,
  `phone_number`,
  `gender`,
  `address`,
  `cover`,
  `bio`,
  `updated_at`,
  `created_at`
FROM
  `user_profile`;

--> statement-breakpoint
DROP TABLE `user_profile`;

--> statement-breakpoint
ALTER TABLE `__new_user_profile`
RENAME TO `user_profile`;

--> statement-breakpoint
PRAGMA foreign_keys = ON;

--> statement-breakpoint
CREATE INDEX `account_user_id_index` ON `account` (`user_id`);

--> statement-breakpoint
CREATE INDEX `invitation_organization_id_index` ON `invitation` (`organization_id`);

--> statement-breakpoint
CREATE INDEX `invitation_inviter_id_index` ON `invitation` (`inviter_id`);

--> statement-breakpoint
CREATE INDEX `member_user_id_index` ON `member` (`user_id`);

--> statement-breakpoint
CREATE INDEX `member_organization_id_index` ON `member` (`organization_id`);

--> statement-breakpoint
CREATE INDEX `organization_role_organization_id_index` ON `organization_role` (`organization_id`);

--> statement-breakpoint
CREATE INDEX `session_user_id_index` ON `session` (`user_id`);

--> statement-breakpoint
CREATE INDEX `team_organization_id_index` ON `team` (`organization_id`);

--> statement-breakpoint
CREATE INDEX `team_member_user_id_index` ON `team_member` (`user_id`);

--> statement-breakpoint
CREATE INDEX `team_member_team_id_index` ON `team_member` (`team_id`);

--> statement-breakpoint
CREATE INDEX `two_factor_user_id_index` ON `two_factor` (`user_id`);

--> statement-breakpoint
CREATE INDEX `verification_identifier_index` ON `verification` (`identifier`);

--> statement-breakpoint
CREATE INDEX `user_profile_user_id_index` ON `user_profile` (`user_id`);
