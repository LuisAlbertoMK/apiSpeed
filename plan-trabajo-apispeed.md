# Plan de Trabajo - apiSpeed

## 1. Resumen
Express legacy (v4.18) + MariaDB + Socket.io. Versión original. **Gaps:** sin tests, JWT básico, architecture monolith.

## 2. Análisis de Gaps

### 2.1 Seguridad
| Gap | Severidad |
|-----|----------|
| JWT sin expiry config | 🟠 Alta |
| No rate limiting | Ausente |
| No input validation | Ausente |
| SQL sin ORM | 🟡 Media - Raw queries |
| CORS restrictivo | 🟡 Media |

### 2.2 Optimización
| Gap | Severidad |
|-----|----------|
| No caching | 🟠 Alta |
| Connection pooling | 🟡 Media |
| No compression | Ausente |
| Queries N+1 | 🟠 Alta |

### 2.3 Arquitectura
| Gap | Severidad |
|-----|----------|
| Monolith | 🟠 Alta |
| No layers (controller/service) | 🟠 Alta |
| Error handling inconsistente | 🟡 Media |
| No logging estructurado | 🟡 Media |

### 2.4 Testing
| Gap | Severidad |
|-----|----------|
| Test coverage | 0% |
| No CI/CD | 🟡 Media |

## 3. Plan Modular

### Módulo 1: Seguridad
```
- [ ] 1.1 JWT con expiry configurable
- [ ] 1.2 Añadir helmet
- [ ] 1.3 Rate limiting basic
- [ ] 1.4 Input sanitization
```
**Estimación:** 4h

### Módulo 2: Refactor Arquitectura
```
- [ ] 2.1 Separar routes/controllers
- [ ] 2.2 Services layer
- [ ] 2.3 Error middleware centralizado
- [ ] 2.4 Pino logging
```
**Estimación:** 8h

### Módulo 3: Performance
```
- [ ] 3.1 MariaDB connection pool
- [ ] 3.2 Response compression
- [ ] 3.3 Redis caching (sesiones)
- [ ] 3.4 Query optimization
```
**Estimación:** 6h

### Módulo 4: Migración a newApiSpeed
```
- [ ] 4.1 Migrar a newApiSpeed
- [ ] 4.2 Deprecar este repo
- [ ] 4.3 DNS update
```
**Nota:** Considerar deprecación total.

## 4. project-index-apispeed.md

### Definición del Problema
API REST original para SpeedPro:
- CRUD clientes, vehículos
- Autenticación JWT
- WebSocket events

### Estado
**Deprecado** - Migrar a newApiSpeed

### Stack Original
```
Express 4.18
MariaDB  
Socket.io 4.7
JWT + bcrypt
```

### Recomendación
Migrar a newApiSpeed y deprecar.