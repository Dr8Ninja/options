-- Canonical values include unknowns, scalar numbers and a two-rate observation.
-- Preserve their source types without making JSON an operational rule model.
ALTER TABLE rule_revision ADD COLUMN value_type varchar(16) NOT NULL DEFAULT 'TEXT';
ALTER TABLE rule_revision ADD COLUMN sale_rate numeric(18,6);
ALTER TABLE rule_revision ADD COLUMN exercise_rate numeric(18,6);
ALTER TABLE rule_revision ADD CONSTRAINT rule_value_shape CHECK (
 (value_type='TEXT' AND value_numeric IS NULL AND sale_rate IS NULL AND exercise_rate IS NULL)
 OR (value_type='UNKNOWN' AND value_numeric IS NULL AND sale_rate IS NULL AND exercise_rate IS NULL)
 OR (value_type='NUMBER' AND value_numeric IS NOT NULL AND sale_rate IS NULL AND exercise_rate IS NULL)
 OR (value_type='RATE_PAIR' AND value_numeric IS NULL AND sale_rate IS NOT NULL AND exercise_rate IS NOT NULL)
);
