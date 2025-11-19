USE DICRI_DB;
GO

PRINT 'Insertando datos iniciales...';
GO

-- Insertar usuarios de prueba
-- Contraseña para todos: "mp123" [ver archivo backend/generarHashPass.js]
-- Hash bcrypt: $2b$10$tHD60nL1RtSw64/9xRDYlerIBTPEgXdvZ.eg4uYUj7dyRGpi20lIa [respeusta de archivo backend/generarHashPass.js]

DECLARE @tecnico1_id INT, @tecnico2_id INT, @coordinador_id INT, @admin_id INT;

-- Usuario Técnico 1
INSERT INTO Usuarios (nombre, email, password, rol)
VALUES ('Jose L', 'tecnico1@mp.gob.gt', '$2b$10$tHD60nL1RtSw64/9xRDYlerIBTPEgXdvZ.eg4uYUj7dyRGpi20lIa', 'TECNICO');
SET @tecnico1_id = SCOPE_IDENTITY();

-- Usuario Técnico 2
INSERT INTO Usuarios (nombre, email, password, rol)
VALUES ('Marina N', 'tecnico2@mp.gob.gt', '$2b$10$tHD60nL1RtSw64/9xRDYlerIBTPEgXdvZ.eg4uYUj7dyRGpi20lIa', 'TECNICO');
SET @tecnico2_id = SCOPE_IDENTITY();

-- Usuario Coordinador
INSERT INTO Usuarios (nombre, email, password, rol)
VALUES ('Pedro P', 'coordinador1@mp.gob.gt', '$2b$10$tHD60nL1RtSw64/9xRDYlerIBTPEgXdvZ.eg4uYUj7dyRGpi20lIa', 'COORDINADOR');
SET @coordinador_id = SCOPE_IDENTITY();

-- Usuario Admin
INSERT INTO Usuarios (nombre, email, password, rol)
VALUES ('Romeo L', 'admin@mp.gob.gt', '$2b$10$tHD60nL1RtSw64/9xRDYlerIBTPEgXdvZ.eg4uYUj7dyRGpi20lIa', 'ADMIN');
SET @admin_id = SCOPE_IDENTITY();

PRINT 'Usuarios creados';

-- Expedientes de ejemplo
DECLARE @exp1_id INT, @exp2_id INT, @exp3_id INT;

INSERT INTO Expedientes (numero_expediente, descripcion, tecnico_id, estado, activo)
VALUES ('MP-2025-001', 'Investigación de robo a mano armada en zona 10', @tecnico1_id, 'EN_REGISTRO', 1);
SET @exp1_id = SCOPE_IDENTITY();

INSERT INTO Expedientes (numero_expediente, descripcion, tecnico_id, estado, activo)
VALUES ('MP-2025-002', 'Homicidio en zona 1 - Evidencias balísticas', @tecnico1_id, 'EN_REVISION', 1);
SET @exp2_id = SCOPE_IDENTITY();

INSERT INTO Expedientes (numero_expediente, descripcion, tecnico_id, estado, coordinador_id, fecha_aprobacion, activo)
VALUES ('MP-2025-003', 'Fraude financiero - Documentos falsificados', @tecnico2_id, 'APROBADO', @coordinador_id, GETDATE(), 1);
SET @exp3_id = SCOPE_IDENTITY();

PRINT 'Expedientes creados';

-- Indicios de ejemplo
INSERT INTO Indicios (expediente_id, descripcion, color, tamanio, peso, ubicacion, tecnico_id, activo)
VALUES 
    (@exp1_id, 'Arma blanca tipo cuchillo', 'Plateado', '25cm', '200g', 'Escena del crimen - Cocina', @tecnico1_id, 1),
    (@exp1_id, 'Huellas dactilares en ventana', NULL, NULL, NULL, 'Ventana principal - Exterior', @tecnico1_id, 1),
    (@exp2_id, 'Casquillos calibre 9mm', 'Dorado', '19mm', '15g', 'Calle principal - 5 metros del cuerpo', @tecnico1_id, 1),
    (@exp2_id, 'Proyectil deformado', 'Gris', '9mm', '8g', 'Pared norte - Incrustado', @tecnico1_id, 1),
    (@exp3_id, 'Documento fiscal alterado', 'Blanco', 'Carta', '5g', 'Oficina - Escritorio principal', @tecnico2_id, 1),
    (@exp3_id, 'Dispositivo USB con datos', 'Negro', '5cm', '10g', 'Cajón de escritorio', @tecnico2_id, 1);

PRINT 'Indicios creados';
GO
