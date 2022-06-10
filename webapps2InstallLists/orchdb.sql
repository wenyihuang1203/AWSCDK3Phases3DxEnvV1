USE [master];
GO

CREATE DATABASE [orchdb]
ON PRIMARY (
    NAME = 'orchdb',
    FILENAME = '/db/system/orchdb.mdf',
    SIZE = 1GB,
    FILEGROWTH = 50%
)
LOG ON (
    NAME = 'orchdb_LOG',
    FILENAME ='/db/system/orchdb_LOG.ldf',
    SIZE = 10MB,
    FILEGROWTH = 25%
);
GO

ALTER DATABASE [orchdb] SET READ_COMMITTED_SNAPSHOT ON;
ALTER DATABASE [orchdb] SET ALLOW_SNAPSHOT_ISOLATION ON;
GO

USE [master];
GO

CREATE LOGIN x3dorch
    WITH PASSWORD    = 'Passport123',
    CHECK_POLICY     = OFF,
    CHECK_EXPIRATION = OFF,
    DEFAULT_DATABASE = [orchdb];
GO

USE [orchdb];  
GO  

CREATE USER [x3dorch] FOR LOGIN [x3dorch];  
GO 

GRANT CREATE TABLE,
      ALTER,
      REFERENCES,
      SELECT,
      INSERT,
      UPDATE,
      DELETE
ON DATABASE::orchdb TO x3dorch;
GO
