DROP VIEW IF EXISTS category_with_count;
DROP TABLE IF EXISTS announcement_categories;
DROP TABLE IF EXISTS announcement;
DROP TABLE IF EXISTS category;

CREATE TABLE IF NOT EXISTS announcement (
	id SERIAL PRIMARY KEY,
	title VARCHAR(25) UNIQUE NOT NULL,
	"content" VARCHAR(300) NOT NULL,
	valid_until DATE NOT NULL,
	important BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(25) UNIQUE NOT NULL,
	"desc" VARCHAR(100) NOT NULL
);

CREATE INDEX "category_name_index" ON category USING HASH ("name");

CREATE TABLE announcement_categories (
	announcement_id INT REFERENCES announcement(id) ON DELETE CASCADE NOT NULL,
	category_id INT REFERENCES category(id) ON DELETE CASCADE NOT NULL
);

CREATE VIEW category_with_count AS
	SELECT
		category.id,
		category.name,
		category.desc,
		(
			SELECT
				COUNT(announcement_id)
			FROM	
				announcement_categories
			WHERE
				category_id = category.id
		) AS announcement_count
	FROM
		category;
		
INSERT INTO announcement (title, "content", valid_until, important)
VALUES ('Test title', 'Test content', 'January 27, 2020', true);

INSERT INTO announcement (title, "content", valid_until, important)
VALUES ('This is important', 'Test content', 'January 27, 2020', false);

INSERT INTO category ("name", "desc")
VALUES ('Test category', 'Test description');

INSERT INTO category ("name", "desc")
VALUES ('Two announcement', 'lorem ipsum');

INSERT INTO category ("name", "desc")
VALUES ('empty category', 'lorem ipsum');

INSERT INTO announcement_categories
VALUES (1, 1);

INSERT INTO announcement_categories
VALUES (1, 2);

INSERT INTO announcement_categories
VALUES (2, 2);
