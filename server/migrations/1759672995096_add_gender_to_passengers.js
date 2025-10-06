/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.addColumn("passengers", {
    gender: {
      type: "text",
      notNull: false, // Allow null initially for existing records
    },
  });
  
  // Set default values for existing records
  pgm.sql("UPDATE passengers SET gender = 'Other' WHERE gender IS NULL");
  
  // Make the column not null after setting defaults
  pgm.alterColumn("passengers", "gender", {
    notNull: true,
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumn("passengers", "gender");
};