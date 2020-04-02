CREATE TABLE endpoints (
    id              INT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    url             TEXT         NOT NULL,
    `interval`      INT          NOT NULL,
    userId          INT          NOT NULL,
    lastCheckedAt   DATETIME     NULL,
    nextRunAt       DATETIME     NULL,
    createdAt       DATETIME     NOT NULL,
    PRIMARY KEY (id),
    INDEX index_user_id (userId)
) DEFAULT CHARSET=utf8
