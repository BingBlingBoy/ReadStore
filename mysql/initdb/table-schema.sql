USE readstore;
CREATE TABLE book(
  isbn VARCHAR(17) NOT NULL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  no_of_pages INT,
  publisher VARCHAR(255),
  publish_date YEAR,
  review TEXT
);
