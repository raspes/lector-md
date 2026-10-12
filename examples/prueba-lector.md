---
title: Documento de prueba — Migración DC → Cloud (datos ficticios)
cliente: ACME Corp (ficticio)
version: 2.4.1
estado: borrador
tags: [jira, jsm, confluence, migracion, xray]
autores:
  - nombre: Autor Demo
    rol: Solutions Architect
---

# Prueba del lector: migración DC → Cloud

Este documento es **ficticio** y existe solo para probar cómo se ve el renderizado. Mezcla tablas anchas, diagramas Mermaid de varios tipos, listas anidadas, código y HTML embebido. Ver la [sección de riesgos](#riesgos-y-mitigaciones) o el [sitio de Atlassian](https://www.atlassian.com).

> [!IMPORTANT]
> Todos los nombres, cifras y fechas son inventados.

> [!WARNING]
> Congelar cambios de esquema 48 h antes del cutover.

> [!TIP]
> Usa el modo **Fuente** para comparar el Markdown crudo con la vista renderizada.

> [!NOTE]
> Esta nota tiene `código en línea`, **negritas** y un [enlace](https://example.com).

> [!CAUTION]
> No ejecutar el script de limpieza en producción sin snapshot previo.

---

## 1. Tablas

### 1.1 Tabla simple con alineaciones

| Fase | Entregable | Horas | Avance |
|:-----|:-----------|------:|:------:|
| 1 | Discovery y análisis de apps | 24 | 100 % |
| 2 | Migración piloto (JCMA) | 40 | 75 % |
| 3 | Migración masiva | 120 | 10 % |
| 4 | Hipercuidado | 32 | 0 % |
| | **Total** | **216** | |

### 1.2 Tabla ancha (12 columnas) con scroll horizontal

| ID | Proyecto | Tipo | Issues | Adjuntos (GB) | Usuarios | Apps críticas | Workflows custom | Campos custom | Riesgo | Ventana | Responsable |
|---|---|---|--:|--:|--:|---|--:|--:|:-:|---|---|
| P-001 | Soporte TI | JSM | 48 210 | 12.4 | 310 | ScriptRunner, Insight | 14 | 62 | Alto | Sáb 02:00–08:00 | Equipo A |
| P-002 | Desarrollo Core | Software | 129 884 | 41.9 | 85 | Xray, Tempo | 9 | 38 | Medio | Dom 01:00–06:00 | Equipo B |
| P-003 | RRHH | Business | 3 120 | 0.6 | 22 | — | 2 | 7 | Bajo | Sáb 08:00–10:00 | Equipo A |
| P-004 | Infraestructura | JSM | 21 440 | 7.1 | 60 | ScriptRunner | 11 | 29 | Alto | Dom 06:00–12:00 | Equipo C |
| P-005 | Portafolio 2026 | JPD | 640 | 0.1 | 40 | — | 1 | 5 | Bajo | Sáb 10:00–11:00 | Equipo B |

### 1.3 Tabla con contenido pesado en celdas

| Componente | Descripción | Configuración de ejemplo | Observaciones |
|---|---|---|---|
| **SLA primera respuesta** | Tiempo máximo hasta la primera respuesta al cliente.<br>Aplica solo en horario hábil. | `goal = 4h`<br>`calendar = "Lun-Vie 8-18"` | Pausar cuando el estado sea *Esperando cliente*. |
| **Automatización de cierre** | Cierra tickets resueltos sin respuesta tras 5 días. | `trigger: issue transitioned`<br>`condition: status = Resuelto`<br>`action: transition → Cerrado` | Probar con `dry run` antes de activar. |
| **Campo "Prioridad real"** | Campo calculado a partir de impacto y urgencia. | `impacto × urgencia`, redondeado hacia arriba | Requiere script; ver bloque de código más abajo. |
| **Pipe escapado** | Celda con un carácter \| literal dentro. | `a \| b` | Caso típico que rompe tablas mal formadas. |

### 1.4 Tabla con muchas filas (para probar el encabezado fijo al hacer scroll)

| # | Tarea | Equipo | Horas | Estado |
|--:|---|---|--:|---|
| 1 | Inventario de apps Marketplace | Strategy | 6 | Hecho |
| 2 | Revisión de compatibilidad Cloud | Strategy | 10 | Hecho |
| 3 | Mapeo de usuarios y grupos | DevOps | 8 | Hecho |
| 4 | Limpieza de campos huérfanos | Dev | 12 | En curso |
| 5 | Consolidación de esquemas de permisos | Dev | 14 | En curso |
| 6 | Pruebas de JCMA en sandbox | DevOps | 16 | En curso |
| 7 | Migración de filtros y tableros | DevOps | 10 | Pendiente |
| 8 | Reescritura de scripts de ScriptRunner | Dev | 30 | Pendiente |
| 9 | Pruebas de integración con SSO | DevOps | 12 | Pendiente |
| 10 | Capacitación a administradores | Delivery | 8 | Pendiente |
| 11 | Pruebas UAT por proyecto piloto | Delivery | 20 | Pendiente |
| 12 | Plan de rollback documentado | Strategy | 6 | Pendiente |
| 13 | Comunicación a usuarios finales | Delivery | 4 | Pendiente |
| 14 | Ventana de cutover piloto | DevOps | 8 | Pendiente |
| 15 | Validación post-migración | Dev | 10 | Pendiente |
| 16 | Ventana de cutover masivo | DevOps | 24 | Pendiente |
| 17 | Hipercuidado semana 1 | Delivery | 16 | Pendiente |
| 18 | Hipercuidado semana 2 | Delivery | 16 | Pendiente |
| 19 | Retrospectiva y cierre | Strategy | 4 | Pendiente |
| 20 | Entrega de documentación final | Strategy | 6 | Pendiente |

---

## 2. Diagramas Mermaid

### 2.1 Flowchart con decisiones y subgrafos

```mermaid
flowchart TD
    A([Inicio de cutover]) --> B{¿Backup validado?}
    B -- Sí --> C[Congelar Data Center]
    B -- No --> D[Reintentar backup]
    D --> B
    C --> E

    subgraph Migración
        direction LR
        E[Ejecutar JCMA] --> F[Migrar adjuntos]
        F --> G[Migrar apps]
    end

    G --> H{¿UAT aprobado?}
    H -- Sí --> I[Abrir Cloud a usuarios]
    H -- No --> J[Rollback]
    J --> K([Fin])
    I --> K
```

### 2.2 Diagrama de secuencia

```mermaid
sequenceDiagram
    autonumber
    participant PM as Project Manager
    participant AD as Admin Atlassian
    participant CL as Cliente
    participant JC as JCMA

    PM->>AD: Solicita ventana de cutover
    AD->>CL: Confirma downtime
    alt Cliente aprueba
        CL-->>AD: Aprobado
        AD->>JC: Inicia migración
        loop Cada 15 min
            JC-->>AD: Estado de progreso
        end
        JC-->>AD: Migración completa
        AD-->>PM: Listo para UAT
    else Cliente rechaza
        CL-->>AD: Rechazado
        AD-->>PM: Reprogramar
    end
    Note over PM,CL: Toda comunicación queda en el ticket de cambio
```

### 2.3 Diagrama de estados (workflow de incidentes)

```mermaid
stateDiagram-v2
    [*] --> Abierto
    Abierto --> EnProgreso: Asignar
    EnProgreso --> EsperandoCliente: Solicitar info
    EsperandoCliente --> EnProgreso: Cliente responde
    EnProgreso --> Resuelto: Aplicar solución
    Resuelto --> Cerrado: Confirmar o 5 días
    Resuelto --> EnProgreso: Reabrir
    Cerrado --> [*]
```

### 2.4 Diagrama entidad-relación

```mermaid
erDiagram
    PROYECTO ||--o{ ISSUE : contiene
    ISSUE }o--|| USUARIO : "asignado a"
    ISSUE ||--o{ COMENTARIO : tiene
    ISSUE ||--o{ ADJUNTO : incluye
    PROYECTO {
        string clave PK
        string nombre
        string tipo
    }
    ISSUE {
        int id PK
        string resumen
        string estado
        date creado
    }
    USUARIO {
        int id PK
        string nombre
        string correo
    }
```

### 2.5 Diagrama de clases

```mermaid
classDiagram
    class Migracion {
        +String id
        +Date inicio
        +ejecutar()
        +revertir()
    }
    class Proyecto {
        +String clave
        +int issues
    }
    class App {
        +String nombre
        +bool compatibleCloud
    }
    Migracion "1" --> "*" Proyecto : migra
    Proyecto "1" --> "*" App : usa
```

### 2.6 Cronograma Gantt

```mermaid
gantt
    title Cronograma de migración
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Preparación
    Discovery            :done,    d1, 2026-11-02, 10d
    Plan de rollback     :active,  d2, after d1, 5d
    section Piloto
    Migración piloto     :         p1, after d2, 7d
    UAT piloto           :         p2, after p1, 5d
    section Masiva
    Cutover masivo       :crit,    m1, after p2, 3d
    Hipercuidado         :         m2, after m1, 14d
```

### 2.7 Gráfico de pastel

```mermaid
pie showData
    title Horas por equipo
    "Strategy" : 46
    "DevOps" : 78
    "Desarrollo" : 66
    "Delivery" : 26
```

### 2.8 Mapa mental

```mermaid
mindmap
  root((Migración))
    Preparación
      Inventario de apps
      Limpieza de datos
      Plan de rollback
    Ejecución
      JCMA
      Adjuntos
      Apps Marketplace
    Validación
      UAT
      Rendimiento
      SSO
    Cierre
      Hipercuidado
      Documentación
```

### 2.9 Línea de tiempo

```mermaid
timeline
    title Hitos del proyecto
    Octubre : Kickoff : Discovery
    Noviembre : Piloto : UAT piloto
    Diciembre : Cutover masivo : Hipercuidado
    Enero : Cierre : Retrospectiva
```

### 2.10 Recorrido de usuario

```mermaid
journey
    title Experiencia del agente tras la migración
    section Día 1
      Inicia sesión con SSO: 4: Agente
      Busca sus tickets: 3: Agente
    section Semana 1
      Resuelve tickets: 4: Agente
      Usa nuevas automatizaciones: 5: Agente, Admin
```

### 2.11 Flujo de ramas Git

```mermaid
gitGraph
    commit id: "base"
    branch migracion
    checkout migracion
    commit id: "scripts"
    commit id: "fixes"
    checkout main
    merge migracion
    commit id: "release"
```

### 2.12 Diagrama muy grande (para probar el zoom)

```mermaid
flowchart LR
    S1[Fuente 1] --> N1[Normaliza 1] --> V1[Valida 1] --> L1[Carga 1] --> R1[Reporte 1]
    S2[Fuente 2] --> N2[Normaliza 2] --> V2[Valida 2] --> L2[Carga 2] --> R2[Reporte 2]
    S3[Fuente 3] --> N3[Normaliza 3] --> V3[Valida 3] --> L3[Carga 3] --> R3[Reporte 3]
    S4[Fuente 4] --> N4[Normaliza 4] --> V4[Valida 4] --> L4[Carga 4] --> R4[Reporte 4]
    S5[Fuente 5] --> N5[Normaliza 5] --> V5[Valida 5] --> L5[Carga 5] --> R5[Reporte 5]
    S6[Fuente 6] --> N6[Normaliza 6] --> V6[Valida 6] --> L6[Carga 6] --> R6[Reporte 6]
    R1 & R2 & R3 --> CONS1[Consolidado A]
    R4 & R5 & R6 --> CONS2[Consolidado B]
    CONS1 & CONS2 --> FINAL[Informe ejecutivo]
```

### 2.13 Diagrama con error (intencional)

El siguiente bloque tiene sintaxis inválida para probar cómo se muestra el error:

```mermaid
flowchart TD
    A --> --> B[[
    C ---> ???
```

---

## 3. Otros elementos difíciles de leer

### 3.1 Listas anidadas y tareas

- Preparación
  - Inventario
    - Apps de Marketplace
      - Compatibles con Cloud
      - Sin versión Cloud (requieren alternativa)
    - Campos personalizados
  - Limpieza
- Ejecución
  1. Congelar DC
  2. Ejecutar JCMA
     1. Proyectos piloto
     2. Resto de proyectos
  3. Validar

Lista de tareas:

- [x] Inventario de apps completo
- [x] Sandbox configurado
- [ ] Validar SSO en Cloud
- [ ] Plan de rollback aprobado
  - [ ] Revisión del cliente
  - [ ] Firma del sponsor

### 3.2 Citas anidadas

> Primer nivel de cita, con **énfasis**.
>
> > Segundo nivel: una decisión tomada en reunión.
> >
> > > Tercer nivel: el motivo detrás de la decisión.

### 3.3 Diagrama ASCII en bloque de código

```text
+-------------+      +--------------+      +-------------+
|  Data       | ---> |   JCMA /     | ---> |   Jira      |
|  Center     |      |   CCMA       |      |   Cloud     |
+-------------+      +--------------+      +-------------+
      |                     |                     ^
      v                     v                     |
+-------------+      +--------------+             |
|  Backups    |      |  Marketplace | ------------+
|  (snapshot) |      |  Apps        |
+-------------+      +--------------+
```

### 3.4 Código en varios lenguajes

```python
def prioridad_real(impacto: int, urgencia: int) -> int:
    """Calcula la prioridad como impacto x urgencia, redondeando hacia arriba."""
    return min(5, max(1, -(-impacto * urgencia // 3)))
```

```json
{
  "proyecto": "P-001",
  "migracion": {
    "ventana": { "inicio": "2026-11-14T02:00:00-06:00", "duracion_horas": 6 },
    "apps": ["ScriptRunner", "Insight"],
    "rollback": true
  }
}
```

```yaml
automation:
  name: cierre-automatico
  trigger: issue_transitioned
  condition:
    status: Resuelto
    sin_respuesta_dias: 5
  action:
    transition: Cerrado
```

```bash
# Línea muy larga para probar el scroll horizontal del bloque de código
curl -s -X POST "https://tu-instancia.example.invalid/rest/api/3/issue" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"fields":{"project":{"key":"P001"},"summary":"Ticket de prueba generado desde script","issuetype":{"name":"Task"}}}'
```

```sql
SELECT p.pkey AS proyecto, COUNT(i.id) AS issues
FROM project p
JOIN jiraissue i ON i.project = p.id
GROUP BY p.pkey
HAVING COUNT(i.id) > 1000
ORDER BY issues DESC;
```

### 3.5 Bloque desplegable (HTML)

<details>
<summary>Ver el detalle del inventario de apps</summary>

Contenido oculto por defecto, con **Markdown dentro** de HTML y una lista:

- ScriptRunner — requiere reescritura
- Insight — migra a Assets
- Xray — versión Cloud disponible

</details>

### 3.6 Teclas, énfasis y caracteres especiales

Presiona <kbd>Ctrl</kbd> + <kbd>K</kbd> para buscar. Texto con ~~tachado~~, **negrita**, *cursiva*, ***ambas***, `código`, y símbolos: → ← ↔ ≥ ≤ ≠ — “comillas” — ñ á é í ó ú ü ¿? ¡!

Línea con
salto forzado mediante dos espacios al final.

### 3.7 Elementos que el lector NO soporta (para ver su comportamiento)

Imagen externa (se bloquea a propósito): ![logo externo](https://example.com/logo.png)

Enlace relativo (no se puede abrir): [otro documento](./otro.md)

Nota al pie en sintaxis extendida[^1] (marked no la procesa).

[^1]: Esta nota al pie probablemente aparezca como texto plano.

---

## Riesgos y mitigaciones

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|--:|---|:-:|:-:|---|
| 1 | Apps sin versión Cloud | Alta | Alto | Evaluar alternativas en Marketplace antes del piloto |
| 2 | Límites de tasa de JCMA | Media | Medio | Dividir la migración en lotes por proyecto |
| 3 | Adjuntos corruptos | Baja | Alto | Validar checksums en sandbox |
| 4 | SSO mal configurado | Media | Alto | Probar con grupo piloto antes del cutover |

## Riesgos y mitigaciones

Este encabezado repite el nombre del anterior, a propósito, para probar que los enlaces `#` y el índice lateral distinguen ambos.
