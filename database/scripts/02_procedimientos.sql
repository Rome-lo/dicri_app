USE DICRI_DB;
GO

PRINT 'Creando Stored Procedures';
GO

--==================== USUARIOS ====================

--SP_INSERTAR_USUARIO
CREATE OR ALTER PROCEDURE SP_INSERTAR_USUARIO
    @nombre NVARCHAR(100),
    @email NVARCHAR(100),
    @password NVARCHAR(255),
    @rol NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Usuarios (nombre, email, password, rol)
    VALUES (@nombre, @email, @password, @rol);
    
    SELECT id, nombre, email, rol, fecha_creacion
    FROM Usuarios
    WHERE id = SCOPE_IDENTITY();
END;
GO

--SP_OBTENER_USUARIO_POR_EMAIL
CREATE OR ALTER PROCEDURE SP_OBTENER_USUARIO_POR_EMAIL
    @email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, nombre, email, password, rol, activo
    FROM Usuarios
    WHERE email = @email AND activo = 1;
END;
GO

--==================== EXPEDIENTES ====================

--SP_INSERTAR_EXPEDIENTE
CREATE OR ALTER PROCEDURE SP_INSERTAR_EXPEDIENTE
    @numero_expediente NVARCHAR(50),
    @descripcion NVARCHAR(500),
    @tecnico_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Expedientes (numero_expediente, descripcion, tecnico_id, estado)
    VALUES (@numero_expediente, @descripcion, @tecnico_id, 'EN_REGISTRO');
    SELECT 
        e.id,
        e.numero_expediente,
        e.descripcion,
        e.fecha_registro,
        e.estado,
        e.activo,
        u.nombre as tecnico_nombre
    FROM Expedientes e
    INNER JOIN Usuarios u ON e.tecnico_id = u.id
    WHERE e.id = SCOPE_IDENTITY();



END;
GO

--SP_OBTENER_EXPEDIENTES
CREATE OR ALTER PROCEDURE SP_OBTENER_EXPEDIENTES
    @fechaInicio DATE = NULL,
    @fechaFin DATE = NULL,
    @estado NVARCHAR(20) = NULL,
    @incluirEliminados BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.id,
        e.numero_expediente,
        e.descripcion,
        e.fecha_registro,
        e.estado,
        e.justificacion_rechazo,
        e.fecha_aprobacion,
        e.activo,
        e.fecha_eliminacion,
        t.nombre as tecnico_nombre,
        t.email as tecnico_email,
        c.nombre as coordinador_nombre,
        elim.nombre as eliminado_por_nombre,
        (SELECT COUNT(*) FROM Indicios WHERE expediente_id = e.id AND activo = 1) as total_indicios
    FROM Expedientes e
    INNER JOIN Usuarios t ON e.tecnico_id = t.id
    LEFT JOIN Usuarios c ON e.coordinador_id = c.id
    LEFT JOIN Usuarios elim ON e.eliminado_por = elim.id
    WHERE 
        (@incluirEliminados = 1 OR e.activo = 1)
        AND (@fechaInicio IS NULL OR CAST(e.fecha_registro AS DATE) >= @fechaInicio)
        AND (@fechaFin IS NULL OR CAST(e.fecha_registro AS DATE) <= @fechaFin)
        AND (@estado IS NULL OR e.estado = @estado)
    ORDER BY e.fecha_registro DESC;


END;
GO

--SP_OBTENER_EXPEDIENTE_POR_ID
CREATE OR ALTER PROCEDURE SP_OBTENER_EXPEDIENTE_POR_ID
    @expediente_id INT,
    @incluirEliminado BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        e.id,
        e.numero_expediente,
        e.descripcion,
        e.fecha_registro,
        e.estado, 
        e.justificacion_rechazo,
        e.fecha_aprobacion, 
        e.activo,
        e.fecha_eliminacion,
        e.tecnico_id,
        t.nombre as tecnico_nombre,
        t.email as tecnico_email,
        e.coordinador_id, 
        c.nombre as coordinador_nombre,
        c.email as coordinador_email,
        elim.nombre as eliminado_por_nombre,
        (SELECT COUNT(*) FROM Indicios WHERE expediente_id = e.id AND activo = 1) as total_indicios
    FROM Expedientes e
    INNER JOIN Usuarios t ON e.tecnico_id = t.id
    LEFT JOIN Usuarios c ON e.coordinador_id = c.id
    LEFT JOIN Usuarios elim ON e.eliminado_por = elim.id
    WHERE e.id = @expediente_id
        AND (@incluirEliminado = 1 OR e.activo = 1);

END;
GO

--SP_ACTUALIZAR_EXPEDIENTE
CREATE OR ALTER PROCEDURE SP_ACTUALIZAR_EXPEDIENTE
    @expediente_id INT,
    @descripcion NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    --Solo se puede actualizar si esta en estado EN_REGISTRO y activo
    IF NOT EXISTS (SELECT 1 FROM Expedientes WHERE id = @expediente_id AND estado = 'EN_REGISTRO' AND activo = 1)
    BEGIN
        RAISERROR('Solo se pueden modificar expedientes activos en estado EN_REGISTRO', 16, 1);
        RETURN;
    END
    
    UPDATE Expedientes
    SET descripcion = @descripcion
    WHERE id = @expediente_id;
    

    EXEC SP_OBTENER_EXPEDIENTE_POR_ID @expediente_id, 0;



END;
GO

--SP_ENVIAR_EXPEDIENTE_A_REVISION
CREATE OR ALTER PROCEDURE SP_ENVIAR_EXPEDIENTE_A_REVISION
    @expediente_id INT
AS
BEGIN
    SET NOCOUNT ON;
    


    --Verificar que tenga al menos un indicio activo
    IF NOT EXISTS (SELECT 1 FROM Indicios WHERE expediente_id = @expediente_id AND activo = 1)
    BEGIN
        RAISERROR('El expediente debe tener al menos un indicio registrado', 16, 1);
        RETURN;
    END
    
    --Verificar que esté en estado EN_REGISTRO y activo
    IF NOT EXISTS (SELECT 1 FROM Expedientes WHERE id = @expediente_id AND estado = 'EN_REGISTRO' AND activo = 1)
    BEGIN
        RAISERROR('El expediente debe estar activo y en estado EN_REGISTRO', 16, 1);
        RETURN;
    END
    

    UPDATE Expedientes
    SET estado = 'EN_REVISION'
    WHERE id = @expediente_id;
    

    EXEC SP_OBTENER_EXPEDIENTE_POR_ID @expediente_id, 0;
END;
GO

--SP_APROBAR_EXPEDIENTE
CREATE OR ALTER PROCEDURE SP_APROBAR_EXPEDIENTE
    @expediente_id INT,
    @coordinador_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    --Verificar que este en revisión y activo
    IF NOT EXISTS (SELECT 1 FROM Expedientes WHERE id = @expediente_id AND estado = 'EN_REVISION' AND activo = 1)
    BEGIN
        RAISERROR('El expediente debe estar activo y en estado EN_REVISION', 16, 1);
        RETURN;
    END
    
    UPDATE Expedientes
    SET 
        estado = 'APROBADO',
        coordinador_id = @coordinador_id,
        fecha_aprobacion = GETDATE(),
        justificacion_rechazo = NULL
    WHERE id = @expediente_id;

    
    EXEC SP_OBTENER_EXPEDIENTE_POR_ID @expediente_id, 0;
    
END;
GO

--SP_RECHAZAR_EXPEDIENTE
CREATE OR ALTER PROCEDURE SP_RECHAZAR_EXPEDIENTE
    @expediente_id INT,
    @coordinador_id INT,
    @justificacion NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @justificacion IS NULL OR LEN(LTRIM(RTRIM(@justificacion))) = 0
    BEGIN
        RAISERROR('La justificación es obligatoria para rechazar', 16, 1);
        RETURN;
    END
    
    --Verificar que esté en revisión y activo
    IF NOT EXISTS (SELECT 1 FROM Expedientes WHERE id = @expediente_id AND estado = 'EN_REVISION' AND activo = 1)
    BEGIN
        RAISERROR('El expediente debe estar activo y en estado EN_REVISION', 16, 1);
        RETURN;
    END
    
    UPDATE Expedientes
    SET 
        estado = 'RECHAZADO',
        coordinador_id = @coordinador_id,
        justificacion_rechazo = @justificacion
    WHERE id = @expediente_id;
    
    EXEC SP_OBTENER_EXPEDIENTE_POR_ID @expediente_id, 0;
END;
GO

--SP_ELIMINAR_EXPEDIENTE
CREATE OR ALTER PROCEDURE SP_ELIMINAR_EXPEDIENTE
    @expediente_id INT,
    @usuario_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    --Solo se pueden eliminar expedientes en estado EN_REGISTRO y activos
    IF NOT EXISTS (SELECT 1 FROM Expedientes WHERE id = @expediente_id AND estado = 'EN_REGISTRO' AND activo = 1)
    BEGIN
        RAISERROR('Solo se pueden eliminar expedientes activos en estado EN_REGISTRO', 16, 1);
        RETURN;
    END
    
    --Marcar expediente como inactivo
    UPDATE Expedientes
    SET 
        activo = 0,
        fecha_eliminacion = GETDATE(),
        eliminado_por = @usuario_id
    WHERE id = @expediente_id;
    
    --Marcar todos los indicios del expediente como inactivos
    UPDATE Indicios
    SET 
        activo = 0,
        fecha_eliminacion = GETDATE(),
        eliminado_por = @usuario_id
    WHERE expediente_id = @expediente_id AND activo = 1;
    
    SELECT 
        'Expediente eliminado lógicamente' as mensaje,
        @expediente_id as expediente_id,
        GETDATE() as fecha_eliminacion,
        (SELECT COUNT(*) FROM Indicios WHERE expediente_id = @expediente_id AND activo = 0 AND eliminado_por = @usuario_id) as indicios_eliminados;
END;
GO

--SP_RESTAURAR_EXPEDIENTE (prueba)
CREATE OR ALTER PROCEDURE SP_RESTAURAR_EXPEDIENTE
    @expediente_id INT,
    @usuario_id INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM Expedientes WHERE id = @expediente_id AND activo = 0)
    BEGIN
        RAISERROR('El expediente no está eliminado', 16, 1);
        RETURN;
    END
    
    UPDATE Expedientes
    SET 
        activo = 1,
        fecha_eliminacion = NULL,
        eliminado_por = NULL
    WHERE id = @expediente_id;
    
    UPDATE Indicios
    SET 
        activo = 1,
        fecha_eliminacion = NULL,
        eliminado_por = NULL
    WHERE expediente_id = @expediente_id;
    
    EXEC SP_OBTENER_EXPEDIENTE_POR_ID @expediente_id, 1;
END;
GO

--==================== INDICIOS ====================

--SP_INSERTAR_INDICIO
CREATE OR ALTER PROCEDURE SP_INSERTAR_INDICIO
    @expediente_id INT,
    @descripcion NVARCHAR(500),
    @color NVARCHAR(50),
    @tamanio NVARCHAR(50),
    @peso NVARCHAR(50),
    @ubicacion NVARCHAR(200),
    @tecnico_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    --Verificar que el expediente esté en estado EN_REGISTRO y activo
    IF NOT EXISTS (SELECT 1 FROM Expedientes WHERE id = @expediente_id AND estado = 'EN_REGISTRO' AND activo = 1)
    BEGIN
        RAISERROR('Solo se pueden agregar indicios a expedientes activos en estado EN_REGISTRO', 16, 1);
        RETURN;
    END
    


    INSERT INTO Indicios (expediente_id, descripcion, color, tamanio, peso, ubicacion, tecnico_id)
    VALUES (@expediente_id, @descripcion, @color, @tamanio, @peso, @ubicacion, @tecnico_id);
    
    SELECT 
        i.id,
        i.expediente_id,
        i.descripcion,
        i.color,
        i.tamanio,
        i.peso,
        i.ubicacion,
        i.fecha_registro,
        i.activo,
        u.nombre as tecnico_nombre
    FROM Indicios i
    INNER JOIN Usuarios u ON i.tecnico_id = u.id
    WHERE i.id = SCOPE_IDENTITY();
END;
GO

--SP_OBTENER_INDICIOS_POR_EXPEDIENTE
CREATE OR ALTER PROCEDURE SP_OBTENER_INDICIOS_POR_EXPEDIENTE
    @expediente_id INT,
    @incluirEliminados BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        i.id,
        i.expediente_id,
        i.descripcion,
        i.color,
        i.tamanio,
        i.peso,
        i.ubicacion,
        i.fecha_registro,
        i.activo,
        i.fecha_eliminacion,
        u.nombre as tecnico_nombre,
        elim.nombre as eliminado_por_nombre
    FROM Indicios i
    INNER JOIN Usuarios u ON i.tecnico_id = u.id
    LEFT JOIN Usuarios elim ON i.eliminado_por = elim.id
    WHERE i.expediente_id = @expediente_id
        AND (@incluirEliminados = 1 OR i.activo = 1)
    ORDER BY i.fecha_registro DESC;


END;
GO

--SP_ACTUALIZAR_INDICIO
CREATE OR ALTER PROCEDURE SP_ACTUALIZAR_INDICIO
    @indicio_id INT,
    @descripcion NVARCHAR(500),
    @color NVARCHAR(50),
    @tamanio NVARCHAR(50),
    @peso NVARCHAR(50),
    @ubicacion NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    --Verificar que el expediente del indicio esté en estado EN_REGISTRO [expediente e indicio activos]]
    --
    IF NOT EXISTS (
        SELECT 1 
        FROM Indicios i
        INNER JOIN Expedientes e ON i.expediente_id = e.id
        WHERE i.id = @indicio_id AND e.estado = 'EN_REGISTRO' AND i.activo = 1 AND e.activo = 1
    )
    BEGIN
        RAISERROR('Solo se pueden modificar indicios activos de expedientes activos en estado EN_REGISTRO', 16, 1);
        RETURN;
    END
    UPDATE Indicios
    SET 
        descripcion = @descripcion,
        color = @color,
        tamanio = @tamanio,
        peso = @peso,
        ubicacion = @ubicacion
    WHERE id = @indicio_id;

    
    SELECT 
        i.id,
        i.expediente_id,
        i.descripcion,
        i.color,
        i.tamanio,
        i.peso,
        i.ubicacion,
        i.fecha_registro,
        i.activo,
        u.nombre as tecnico_nombre
    FROM Indicios i
    INNER JOIN Usuarios u ON i.tecnico_id = u.id
    WHERE i.id = @indicio_id;

END;
GO

--SP_ELIMINAR_INDICIO
CREATE OR ALTER PROCEDURE SP_ELIMINAR_INDICIO
    @indicio_id INT,
    @usuario_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    --Verificar que el expediente del indicio esté en estado EN_REGISTRO [expediente e indicio activos]
    IF NOT EXISTS (
        SELECT 1 
        FROM Indicios i
        INNER JOIN Expedientes e ON i.expediente_id = e.id
        WHERE i.id = @indicio_id AND e.estado = 'EN_REGISTRO' AND i.activo = 1 AND e.activo = 1
    )
    BEGIN
        RAISERROR('Solo se pueden eliminar indicios activos de expedientes activos en estado EN_REGISTRO', 16, 1);
        RETURN;
    END
    
    --Marcar indicio como inactivo
    UPDATE Indicios
    SET 
        activo = 0,
        fecha_eliminacion = GETDATE(),
        eliminado_por = @usuario_id
    WHERE id = @indicio_id;
    

    SELECT 
        'Indicio eliminado' as mensaje,
        @indicio_id as indicio_id,
        GETDATE() as fecha_eliminacion;
END;
GO

--SP_RESTAURAR_INDICIO (prueba)
CREATE OR ALTER PROCEDURE SP_RESTAURAR_INDICIO
    @indicio_id INT,
    @usuario_id INT
AS
BEGIN
    SET NOCOUNT ON;
    --Verificar que el indicio esté eliminado (contrario de activo)
    IF NOT EXISTS (SELECT 1 FROM Indicios WHERE id = @indicio_id AND activo = 0)
    BEGIN
        RAISERROR('El indicio no está eliminado', 16, 1);
        RETURN; 
    END
    --Verificar que el expediente padre esté activo
    IF NOT EXISTS (
        SELECT 1 FROM Indicios i
        INNER JOIN Expedientes e ON i.expediente_id = e.id
        WHERE i.id = @indicio_id AND e.activo = 1
    ) 
    BEGIN 
        RAISERROR('No se puede restaurar un indicio de un expediente eliminado', 16, 1);--Para pruebas, no logico
        RETURN;
    END
    --Restaurar indicio
    UPDATE Indicios
    SET 
        activo = 1,
        fecha_eliminacion = NULL,
        eliminado_por = NULL
    WHERE id = @indicio_id;
    
    SELECT 
        i.id,
        i.expediente_id,
        i.descripcion,
        i.activo,
        u.nombre as tecnico_nombre
    FROM Indicios i
    INNER JOIN Usuarios u ON i.tecnico_id = u.id
    WHERE i.id = @indicio_id;
END;
GO

--==================== REPORTES ====================

--SP_GENERAR_REPORTE
CREATE OR ALTER PROCEDURE SP_GENERAR_REPORTE
    @fechaInicio DATE = NULL,
    @fechaFin DATE = NULL,
    @incluirEliminados BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    ----------------------------------------------------------------------------------------------------------------
    --Resumen general
    SELECT 
        COUNT(*) as total_expedientes,
        SUM(CASE WHEN estado = 'EN_REGISTRO' THEN 1 ELSE 0 END) as en_registro,
        SUM(CASE WHEN estado = 'EN_REVISION' THEN 1 ELSE 0 END) as en_revision,
        SUM(CASE WHEN estado = 'APROBADO' THEN 1 ELSE 0 END) as aprobados,
        SUM(CASE WHEN estado = 'RECHAZADO' THEN 1 ELSE 0 END) as rechazados,
        (SELECT COUNT(*) FROM Indicios i 
         INNER JOIN Expedientes e ON i.expediente_id = e.id
         WHERE i.activo = 1 AND e.activo = 1
           AND (@fechaInicio IS NULL OR CAST(e.fecha_registro AS DATE) >= @fechaInicio)
           AND (@fechaFin IS NULL OR CAST(e.fecha_registro AS DATE) <= @fechaFin)) as total_indicios,
        (SELECT COUNT(*) FROM Expedientes WHERE activo = 0) as total_eliminados
    FROM Expedientes
    WHERE 
        (@incluirEliminados = 1 OR activo = 1)
        AND (@fechaInicio IS NULL OR CAST(fecha_registro AS DATE) >= @fechaInicio)
        AND (@fechaFin IS NULL OR CAST(fecha_registro AS DATE) <= @fechaFin);

    ----------------------------------------------------------------------------------------------------------------
    --Expedientes por tecnico
    SELECT 
        u.id,
        u.nombre as tecnico,
        COUNT(e.id) as total_expedientes,
        SUM(CASE WHEN e.estado = 'APROBADO' THEN 1 ELSE 0 END) as aprobados,
        SUM(CASE WHEN e.estado = 'RECHAZADO' THEN 1 ELSE 0 END) as rechazados,
        SUM(CASE WHEN e.activo = 0 THEN 1 ELSE 0 END) as eliminados
    FROM Usuarios u
    LEFT JOIN Expedientes e ON u.id = e.tecnico_id
        AND (@fechaInicio IS NULL OR CAST(e.fecha_registro AS DATE) >= @fechaInicio)
        AND (@fechaFin IS NULL OR CAST(e.fecha_registro AS DATE) <= @fechaFin)
    WHERE u.rol = 'TECNICO' AND u.activo = 1
    GROUP BY u.id, u.nombre
    ORDER BY total_expedientes DESC;
    
    ----------------------------------------------------------------------------------------------------------------
    --Expedientes por dia (sino de mes)
    DECLARE @inicio DATE = ISNULL(@fechaInicio, DATEADD(DAY, -30, GETDATE()));
    DECLARE @fin DATE = ISNULL(@fechaFin, GETDATE());
    SELECT 
        CAST(fecha_registro AS DATE) as fecha,
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'APROBADO' THEN 1 ELSE 0 END) as aprobados,
        SUM(CASE WHEN estado = 'RECHAZADO' THEN 1 ELSE 0 END) as rechazados,
        SUM(CASE WHEN activo = 0 THEN 1 ELSE 0 END) as eliminados
    FROM Expedientes
    WHERE CAST(fecha_registro AS DATE) >= @inicio 
        AND CAST(fecha_registro AS DATE) <= @fin
    GROUP BY CAST(fecha_registro AS DATE)
    ORDER BY fecha DESC;

    ----------------------------------------------------------------------------------------------------------------
END;
GO

PRINT '';
PRINT 'Stored procedures creados exitosamente';
PRINT '';
GO