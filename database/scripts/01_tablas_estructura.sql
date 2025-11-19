IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DICRI_DB')
BEGIN
    CREATE DATABASE DICRI_DB;
END
GO

USE DICRI_DB;
GO

-- Eliminar tablas si existen
IF OBJECT_ID('Indicios', 'U') IS NOT NULL DROP TABLE Indicios;
IF OBJECT_ID('Expedientes', 'U') IS NOT NULL DROP TABLE Expedientes;
IF OBJECT_ID('Usuarios', 'U') IS NOT NULL DROP TABLE Usuarios;
GO

-- Tabla de Usuarios
CREATE TABLE Usuarios ( 
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    rol NVARCHAR(20) NOT NULL,
    activo BIT DEFAULT 1, 
    fecha_creacion DATETIME DEFAULT GETDATE()
);
GO

-- Tabla de Expedientes
CREATE TABLE Expedientes (
    id INT IDENTITY(1,1) PRIMARY KEY, 
    numero_expediente NVARCHAR(50) UNIQUE NOT NULL,
    descripcion NVARCHAR(500),
    fecha_registro DATETIME DEFAULT GETDATE(),
    estado NVARCHAR(20) NOT NULL DEFAULT 'EN_REGISTRO',
    tecnico_id INT NOT NULL,
    coordinador_id INT NULL, 
    justificacion_rechazo NVARCHAR(500) NULL,
    fecha_aprobacion DATETIME NULL,
    activo BIT DEFAULT 1 NOT NULL,
    fecha_eliminacion DATETIME NULL, 
    eliminado_por INT NULL,
    FOREIGN KEY (tecnico_id) REFERENCES Usuarios(id),
    FOREIGN KEY (coordinador_id) REFERENCES Usuarios(id), 
    FOREIGN KEY (eliminado_por) REFERENCES Usuarios(id)
);
GO

--Tabla de Indicios
CREATE TABLE Indicios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    expediente_id INT NOT NULL,
    descripcion NVARCHAR(500) NOT NULL,
    color NVARCHAR(50),
    tamanio NVARCHAR(50),
    peso NVARCHAR(50), 
    ubicacion NVARCHAR(200),
    tecnico_id INT NOT NULL,
    fecha_registro DATETIME DEFAULT GETDATE(),
    activo BIT DEFAULT 1 NOT NULL, 
    fecha_eliminacion DATETIME NULL,
    eliminado_por INT NULL,
    FOREIGN KEY (expediente_id) REFERENCES Expedientes(id),
    FOREIGN KEY (tecnico_id) REFERENCES Usuarios(id),
    FOREIGN KEY (eliminado_por) REFERENCES Usuarios(id)
);
GO

--Indices para mejor performance
CREATE INDEX IX_Expedientes_Estado ON Expedientes(estado);
CREATE INDEX IX_Expedientes_Fecha ON Expedientes(fecha_registro);
CREATE INDEX IX_Expedientes_Activo ON Expedientes(activo);
CREATE INDEX IX_Indicios_Expediente ON Indicios(expediente_id);
CREATE INDEX IX_Indicios_Activo ON Indicios(activo);
GO

PRINT 'Tablas creadas exitosamente';
GO