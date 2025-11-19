# Sistema DICRI - Ministerio Público de Guatemala

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Rome-lo/dicri_app.git
cd dicri-app
```

Correr script tablas con

docker exec -it dicri-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "admin@12345" -C \
  -i /scripts/01_tablas_estructura.sql

Correr script procedimientos con

docker exec -it dicri-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "admin@12345" -C \
  -i /scripts/02_procedimientos.sql

Correr script data preuba con

docker exec -it dicri-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "admin@12345" -C \
  -i /scripts/03_data_prueba.sql


# Levantar sqlserver
# Limpiar todo
docker-compose down -v

# Levantar
docker-compose up

# Ejecutar scripts
./database.sh  