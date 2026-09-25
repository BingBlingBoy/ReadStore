USE readstore;
CREATE TABLE book(
  id_bin BINARY(16) NOT NULL PRIMARY KEY,
  id_text VARCHAR (36) GENERATED ALWAYS AS (bin_to_uuid(id_bin)) VIRTUAL,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(17),
  no_of_pages INT,
  publisher VARCHAR(255),
  publish_date YEAR,
  review TEXT
);
