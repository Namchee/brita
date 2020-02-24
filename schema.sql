DROP VIEW IF EXISTS category_with_count;
DROP TABLE IF EXISTS announcement_categories;
DROP TABLE IF EXISTS announcement;
DROP TABLE IF EXISTS category;

CREATE TABLE IF NOT EXISTS announcement (
	id SERIAL PRIMARY KEY,
	title VARCHAR(25) UNIQUE NOT NULL,
	"content" VARCHAR(300) NOT NULL,
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
