-- A month-only citation is not a date on the first day of that month.
ALTER TABLE official_notice ADD COLUMN publication_date_raw varchar(80);
ALTER TABLE official_notice ADD COLUMN publication_precision varchar(12) NOT NULL DEFAULT 'unknown'
 CHECK (publication_precision IN ('day','month','year','unknown','verbatim'));
