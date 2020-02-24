DROP VIEW IF EXISTS category_with_count;
DROP TABLE IF EXISTS announcement_categories;
DROP TABLE IF EXISTS announcement;
DROP TABLE IF EXISTS category;

CREATE TABLE IF NOT EXISTS announcement (
	id SERIAL PRIMARY KEY,
	title VARCHAR(25) UNIQUE NOT NULL,
	"content" VARCHAR(250) NOT NULL,
	valid_until DATE NOT NULL
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
		
INSERT INTO announcement (title, "content", valid_until)
VALUES ('Test title', 'Test content', 'October 19, 2020');

INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important', 'Test content', 'December 20, 2020');

/**
 * Batched for testing
*/
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important1', 'Test content 1', 'January 11, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important2', 'Test content 2', 'December 20, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important3', 'Test content 2', 'December 20, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important4', 'Test content 2', 'December 20, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important5', 'Test content 2', 'December 20, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important6', 'Test content 2', 'December 20, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important7', 'Test content 2', 'December 20, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important8', 'Test content 2', 'December 20, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important9', 'Test content 2', 'December 20, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important10', 'Test content 2', 'December 20, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important11', 'Test content 2', 'December 20, 2020');
INSERT INTO announcement (title, "content", valid_until)
VALUES ('This is important12', 'Test content 2', 'December 20, 2020');

INSERT INTO category ("name", "desc")
VALUES ('Anak', 'Kategori ini merupakan kategori yang menampung pengumuman mengenai kebaktian sekolah minggu');

INSERT INTO category ("name", "desc")
VALUES ('Remaja', 'Kategori ini merupakan kategori yang menampung pengumuman mengenai kebaktian kaum muda');

INSERT INTO category ("name", "desc")
VALUES ('Umum', 'Kategori ini merupakan kategori yang menampung pengumuman mengenai kebaktian umum');

INSERT INTO announcement_categories
VALUES (1, 1);

INSERT INTO announcement_categories
VALUES (1, 2);

INSERT INTO announcement_categories
VALUES (2, 2);

INSERT INTO announcement_categories
VALUES (3, 2);

INSERT INTO announcement_categories
VALUES (4, 2);

INSERT INTO announcement_categories
VALUES (5, 2);

INSERT INTO announcement_categories
VALUES (6, 2);

INSERT INTO announcement_categories
VALUES (7, 2);

INSERT INTO announcement_categories
VALUES (8, 2);

INSERT INTO announcement_categories
VALUES (9, 2);

INSERT INTO announcement_categories
VALUES (10, 2);

INSERT INTO announcement_categories
VALUES (11, 2);

INSERT INTO announcement_categories
VALUES (12, 2);

INSERT INTO announcement_categories
VALUES (13, 2);
