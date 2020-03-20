DROP INDEX IF EXISTS "category_name_index";
DROP VIEW IF EXISTS category_with_count;
DROP TABLE IF EXISTS administrator;
DROP TABLE IF EXISTS announcement_categories;
DROP TABLE IF EXISTS announcement;
DROP TABLE IF EXISTS category;

CREATE TABLE IF NOT EXISTS announcement (
	id SERIAL PRIMARY KEY,
	title VARCHAR(50) UNIQUE NOT NULL,
	"contents" VARCHAR(300) NOT NULL,
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
		
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Dropping Like Flies', 'There''s a message for you if you look up.
He was surprised that his immense laziness was inspirational to others.
Not all people who wander are lost.', '2020-10-20');

INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Knock Your Socks Off', 'I would have gotten the promotion, but my attendance wasn’t good enough.
Sometimes I stare at a door or a wall and I wonder what is this reality, why am I alive, and what is this all about?', 'December 20, 2020');

/**
 * Batched for testing
*/
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Shot In the Dark', 'My Mum tries to be cool by saying that she likes all the same things that I do.
She felt that chill that makes the hairs on the back of your neck when he walked into the room.
He learned the hardest lesson of his life and had the scars, both physical and mental, to prove it.', '2020-01-11');
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Down And Out', 'It''s much more difficult to play tennis with a bowling ball than it is to bowl with a tennis ball.
His mind was blown that there was nothing in space except space itself.
Her life in the confines of the house became her new normal.', 'December 20, 2020');
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Tough It Out', 'The shark-infested South Pine channel was the only way in or out.
Charles ate the french fries knowing they would be his last meal.
As you consider all the possible ways to improve yourself and the world, you notice John Travolta seems fairly unhappy.', 'December 20, 2020');
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Playing For Keeps', 'I may struggle with geography, but I''m sure I''m somewhere around here.
It was a really good Monday for being a Saturday.
Erin accidentally created a new universe.
You bite up because of your lower jaw.', 'December 20, 2020');
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('High And Dry', 'She saw the brake lights, but not in time.
The swirled lollipop had issues with the pop rock candy.
In that instant, everything changed.
He had reached the point where he was paranoid about being paranoid.', 'December 20, 2020');
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Barking Up The Wrong Tree', 'He put heat on the wound to see what would grow.
He was disappointed when he found the beach to be so sandy and the sun so sunny.
He learned the hardest lesson of his life and had the scars, both physical and mental, to prove it.', 'December 20, 2020');
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Eat My Hat', 'Iron pyrite is the most foolish of all minerals.
His son quipped that power bars were nothing more than adult candy bars.
Carol drank the blood as if she were a vampire.
Hit me with your pet shark!', 'December 20, 2020');
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Long In The Tooth', 'Pair your designer cowboy hat with scuba gear for a memorable occasion.
In the end, he realized he could see sound and hear words.
This made him feel like an old-style rootbeer float smells.', 'December 20, 2020');
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('In the Red', 'They were excited to see their first sloth.
Don''t put peanut butter on the dog''s nose.
There were white out conditions in the town; subsequently, the roads were impassable.
The memory we used to share is no longer coherent.', 'December 20, 2020');
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Throw In the Towel', 'The pet shop stocks everything you need to keep your anaconda happy.
He didn''t understand why the bird wanted to ride the bicycle.
Pantyhose and heels are an interesting choice of attire for the beach.', 'December 20, 2020');
INSERT INTO announcement (title, "contents", valid_until)
VALUES ('Ring Any Bells?', 'She is never happy until she finds something to be unhappy about; then, she is overjoyed.
He is no James Bond; his name is Roger Moore.
Lightning Paradise was the local hangout joint where the group usually ended up spending the night.', 'December 20, 2020');

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

CREATE TABLE IF NOT EXISTS administrator (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(100),
	email VARCHAR(100) NOT NULL,
	profile_pic VARCHAR(200),
	is_root BOOLEAN NOT NULL,
	is_active BOOLEAN NOT NULL
);

INSERT INTO administrator (email, is_root, is_active)
VALUES ('cristophernamchee12@gmail.com', true, false);
