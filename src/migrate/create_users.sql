CREATE TABLE users (
    id           INT          NOT NULL AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(50)  NOT NULL,
    accessToken  VARCHAR(50)  NULL,
    PRIMARY KEY (id)
) DEFAULT CHARSET=utf8
