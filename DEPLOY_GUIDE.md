# Guía de Deploy en Vercel - apiSpeed

## 🚀 Pasos para Deploy

### 1. Conectar a Vercel
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **Add New** → **Project**
3. Importa el repositorio: `LuisAlbertoMK/apiSpeed`
4. Click en **Continue**

### 2. Configurar Environment Variables
En **Environment Variables**, agrega:

| Variable | Valor |
|----------|-------|
| `SUPABASE_URL` | `https://isqikteedxqtwcdaznwg.supabase.co` |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzcWlrdGVlZHhxdHdjZGF6bndnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkxNDM1MywiZXhwIjoyMDg2NDkwMzUzfQ.vi9aBhUcozb0cRpXSjndKgxK7sxxBbh26OIIFdz6sJQ` |
| `JWT_SECRET` | `MtY845@_1gts` |
| `APP_PORT` | `3000` |

### 3. Deploy
1. Click en **Deploy**
2. Espera el proceso de build y deploy
3. Anota la URL del deploy (ej: `https://api-speed-xxx.vercel.app`)

### 4. Verificar
Testea el endpoint:
```bash
curl https://api-speed-xxx.vercel.app/api/auth
```

### 5. Actualizar Frontend (si la URL cambió)
Si la URL del backend no es `https://api-speed.vercel.app`:
1. Edita `SpeedPro/src/environments/environment.prod.ts`
2. Cambia `API_URI` a la URL correcta
3. Haz commit y push del frontend

## 🧪 Tests Post-Deploy

### Login Test
```bash
curl -X POST https://api-speed-xxx.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@speedpro.com","password":"123456"}'
```

### Frontend Test
1. Ve a `https://speed-pro.vercel.app/inicio`
2. Intenta login con: `admin@speedpro.com` / `123456`

## 🔧 Troubleshooting

### Error: DEPLOYMENT_NOT_FOUND
- El proyecto no está conectado a Vercel
- Sigue los pasos de la sección 1

### Error: Variables de entorno
- Revisa que todas las variables estén configuradas
- Las claves de Supabase deben ser exactas

### Error: CORS
- Revisa la whitelist en `src/app.js`
- La URL del frontend debe estar incluida

### Error: Base de datos
- Verifica que las tablas existan en Supabase
- Revisa las credenciales de Supabase

## 📊 Estado Actual

- ✅ Backend migrado a Supabase
- ✅ Frontend configurado para Vercel
- ✅ Usuario de prueba creado
- ✅ Commits realizados
- ⏳ Esperando deploy en Vercel

## 🎯 URLs Finales

- Backend: `https://api-speed.vercel.app` (o la URL que te dé Vercel)
- Frontend: `https://speed-pro.vercel.app`
- Supabase: `https://supabase.com/dashboard/project/isqikteedxqtwcdaznwg`
