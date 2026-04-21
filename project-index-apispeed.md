# Project Index - apiSpeed

## Definición del Problema

### Problema Principal
API REST original para SpeedPro (v1.0.0). Proveía servicios básicos:
- Autenticación JWT
- CRUD clientes, vehículos
- WebSocket events

### Necesidad de Evolución
**DEPRECATED** - Migrar a newApiSpeed

### Razones de Deprecación
| Razón | Severidad |
|-------|-----------|
| Sin tests | 🟠 Alta |
| Sin rate limiting | 🟠 Alta |
| Sin observabilidad | 🟠 Alta |
| Queries raw SQL | 🟡 Media |
| Arquitectura monolith | 🟡 Media |

---

## Estado Actual
**En mantenimiento** - Solo parches críticos

---

## Stack Original
```
Node: 18+
Express: 4.18
MariaDB
Socket.io: 4.7
JWT + bcryptjs
```

### Endpoints Históricos
```
POST   /auth/login
GET    /clientes
POST   /clientes
GET    /vehiculos
POST   /vehiculos
PUT    /clientes/:id
DELETE /clientes/:id
```

---

## Recomendación

### Acción: Deprecación
1. Migrar tráfico a newApiSpeed
2. Mantener apiSpeed 3 meses con redirects
3. Decommission total

###迁移 Checklist
- [ ] DNS update (newApiSpeed)
- [ ] Client SDK update
- [ ] Monitoring transfer
- [ ] Database migration
- [ ] Archive repo

---

## Métricas de Migración
| Métrica | Target |
|---------|--------|
| Downtime | < 5min |
| Request loss | 0% |
| Rollback time | < 10min |