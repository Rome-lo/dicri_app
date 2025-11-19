#!/bin/bash

echo "Configurando Base de Datos DICRI..."
echo ""

SQLCMD="/opt/mssql-tools18/bin/sqlcmd"
PASSWORD="admin@12345"

echo "Creando tablas..."
docker exec -it dicri-sqlserver $SQLCMD -S localhost -U sa -P "$PASSWORD" -C -i /scripts/01_tablas_estructura.sql

echo ""
echo "Creando stored procedures..."
docker exec -it dicri-sqlserver $SQLCMD -S localhost -U sa -P "$PASSWORD" -C -i /scripts/02_procedimientos.sql

echo ""
echo "Insertando datos de prueba..."
docker exec -it dicri-sqlserver $SQLCMD -S localhost -U sa -P "$PASSWORD" -C -i /scripts/03_data_prueba.sql

echo ""
echo "Base de datos configurada exitosamente"
echo ""
echo "Puedes conectarte a la base de datos DICRI en el servidor 'localhost,1433' con el usuario 'sa' y la contraseña '$PASSWORD'."