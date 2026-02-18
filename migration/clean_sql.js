const fs = require('fs');
const path = require('path');

const filePath = 'd:\\VERCEL\\apiSpeed\\migration\\supabase_raw.sql';
console.log('Reading file:', filePath);

let content = fs.readFileSync(filePath, 'utf8');

// 0. Remove MariaDB specific comments and set statements
content = content.replace(/^\/\*!.*?\*\/;/gm, '');
content = content.replace(/^SET .*?;/gm, '');
content = content.replace(/--.*?\n/g, '\n'); // Remove SQL comments to simplify regex

// 1. Remove backticks
content = content.replace(/`/g, '');

// 2. Remove MySQL/MariaDB specific DROP/CREATE DATABASE and USE
content = content.replace(/DROP DATABASE IF EXISTS.*?;/gi, '');
content = content.replace(/CREATE DATABASE IF NOT EXISTS.*?;/gi, '');
content = content.replace(/USE .*?;/gi, '');

// 3. Convert AUTO_INCREMENT to SERIAL PRIMARY KEY
content = content.replace(/(\w+)\s+int\(\d+\)\s+(?:unsigned\s+)?(?:NOT\s+NULL\s+|DEFAULT\s+NULL\s+)?AUTO_INCREMENT/gi, '$1 SERIAL PRIMARY KEY');

// 4. Remove standalone PRIMARY KEY (id) and KEY/INDEX constraints
content = content.replace(/,\s*PRIMARY KEY\s*\(.*?\)/gi, '');
content = content.replace(/,\s*(?:UNIQUE\s+)?KEY\s+\w+\s+\(.*?\)/gi, '');
content = content.replace(/,\s*CONSTRAINT\s+\w+\s+FOREIGN\s+KEY\s+\(.*?\)\s+REFERENCES\s+\w+\s+\(.*?\)(?:\s+ON\s+DELETE\s+\w+)?/gi, '');

// 5. Remove MariaDB specific table options at the end of CREATE TABLE
content = content.replace(/\)\s*ENGINE=\w+.*?;/gi, ');');
content = content.replace(/DEFAULT CHARSET=\w+/gi, '');
content = content.replace(/COLLATE=\w+/gi, '');

// 6. Fix numeric types with precision (PostgreSQL doesn't support SMALLINT(1))
content = content.replace(/\bSMALLINT\(\d+\)/gi, 'SMALLINT');
content = content.replace(/\bINTEGER\(\d+\)/gi, 'INTEGER');
content = content.replace(/\bINT\(\d+\)/gi, 'INTEGER');

// 7. Convert types
content = content.replace(/\bTINYINT\(1\)\b/gi, 'BOOLEAN');
content = content.replace(/\bTINYINT\b/gi, 'SMALLINT');
content = content.replace(/\bDATETIME\b/gi, 'TIMESTAMPTZ');
content = content.replace(/\bLONGTEXT\b/gi, 'TEXT');
content = content.replace(/\bMEDIUMTEXT\b/gi, 'TEXT');
content = content.replace(/\bDOUBLE\b/gi, 'DOUBLE PRECISION');
content = content.replace(/\s+unsigned/gi, '');

// 8. SQL compatibility
content = content.replace(/REPLACE\s+INTO/gi, 'INSERT INTO');
content = content.replace(/ON UPDATE current_timestamp\(\)/gi, ''); // PostgreSQL doesn't have this inline

// 9. Remove database/schema prefix
content = content.replace(/desarrollo\./gi, '');

// 10. Clean up empty lines and double spaces
content = content.replace(/\n\s*\n/g, '\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Migration SQL cleanup complete.');
