#!/usr/bin/env bash
set -e

# Despliega el proyecto usando Docker Compose.
# Asegúrate de ejecutar este script desde la raíz del repositorio.

docker compose pull || true
docker compose up -d --build
