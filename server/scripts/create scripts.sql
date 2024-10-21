-- Switch to the OnthiBlog_DB schema
USE onthisblog_db;

-- Create Users Table
CREATE TABLE Authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL
);

-- Create Posts Table
CREATE TABLE Posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT,
    image VARCHAR(255),
    content TEXT,
    publish_date DATE,
    likes INT DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES Authors(author_id) ON DELETE CASCADE
);

-- Create Comments Table
CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    comment_author VARCHAR(100),
    content TEXT,
    FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE
);

-- Create PostLikes Table
CREATE TABLE PostLikes (
    post_id INT,
    user_id INT,
    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Authors(author_id) ON DELETE CASCADE
);



