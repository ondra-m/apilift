CREATE TABLE monitoringResults (
    id         INT      NOT NULL AUTO_INCREMENT,
    endpointId INT      NOT NULL,
    userId     INT      NOT NULL,
    checkedAt  DATETIME NOT NULL,
    httpCode   INT      NOT NULL,
    payload    TEXT     NOT NULL,
    PRIMARY KEY (id),
    INDEX index_endpoint_dd (endpointId)
) DEFAULT CHARSET=utf8
