-- ============================================================
-- CLEANUP: Eliminar datos de prueba / test data
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Orden: clientes primero (CASCADE borra vehiculos, recepciones,
--        cotizaciones, etc.), luego usuarios de prueba.
-- ============================================================

-- ============================================================
-- PASO 0: VERIFICACIÓN PREVIA (ejecutar primero, solo SELECT)
-- Descomenta cada bloque para revisar qué se va a eliminar.
-- ============================================================

/*
-- Clientes de prueba identificados:
SELECT id_cliente, nombre, apellidos, correo, no_cliente
FROM clientes
WHERE id_cliente IN (
  1467, 1535, 1536, 1560, 1561, 1569,
  1584, 1585, 1586, 1587, 1597, 1602,
  1607, 1613, 1614, 1615, 1625, 1634,
  1635, 1636, 1637
)
ORDER BY id_cliente;

-- Auth de prueba por email:
SELECT id_usuario, correo
FROM auth
WHERE correo ILIKE '%prueba%'
   OR correo ILIKE '%test%'
   OR correo IN (
     'p1pago@gmail.com','p2pago@gmail.com','p3pago@gmail.com',
     'p4pago@gmail.com','prp@gmail.com','pruebactaller@gmail.com',
     'tetaller1@gmail.com','juan@gmail.com','juan1@gmail.com',
     'juan2@gmail.com','ger2@gmail.com','cp1@gmail.com','cpd@gmail.com',
     'p1felix@gmail.com','p3@gmail.com','mkoromini94@gmail.com',
     'pt1@gmail.com','p3pago@gmail.com','carolina1@gmail.com'
   )
ORDER BY id_usuario;
*/

-- ============================================================
-- PASO 1: Eliminar CLIENTES de prueba
-- ON DELETE CASCADE en la DB se encargará de:
--   → cliente_taller_sucursal
--   → vehiculos → cotizaciones, recepciones, elementoscotizacion,
--                 elementosrecepcion, reportes, reportescotizacion,
--                 pagosorden, gastosorden, pagototalorden
--   → contactocliente
-- ============================================================

DELETE FROM clientes
WHERE id_cliente IN (
  1467,   -- 'deleteSTE' del
  1535,   -- Cliente Prueba uno
  1536,   -- Cliente Prueba Dos
  1560,   -- Prueba Uno (felix)
  1561,   -- Prueba tres
  1569,   -- MKpruebas / pruebasMK
  1584,   -- prueba pagouno
  1585,   -- prueba pagodos
  1586,   -- prueba pagotres
  1587,   -- prueba pagocuatro
  1597,   -- Prueba Carolina
  1602,   -- Prueba uno (prueba1@)
  1607,   -- test uno (test1@)
  1613,   -- Juan David (prueba2@)
  1614,   -- JUAN DAVID (prueba3@)
  1615,   -- elvis (prueba3@)
  1625,   -- prueba Flores (pt1@)
  1634,   -- Prueba Uno (Genaro)
  1635,   -- Prueba Dos (Genaro)
  1636,   -- Prueba tres (Genaro)
  1637    -- Prueba cuatro (Genaro)
);

-- Eliminación por patrón (captura cualquier prueba que no esté en la lista anterior)
DELETE FROM clientes
WHERE (
  nombre ILIKE '%prueba%'
  OR nombre ILIKE '%test%'
  OR apellidos ILIKE '%prueba%'
  OR apellidos ILIKE '%deleteSTE%'
  OR correo ILIKE '%prueba%'
  OR correo ILIKE '%test%'
  OR correo IN (
    'cp1@gmail.com', 'cpd@gmail.com', 'p1felix@gmail.com',
    'p3@gmail.com', 'mkoromini94@gmail.com', 'pt1@gmail.com',
    'carolina1@gmail.com', 'p1pago@gmail.com', 'p2pago@gmail.com',
    'p3pago@gmail.com', 'p4pago@gmail.com'
  )
);

-- ============================================================
-- PASO 2: Eliminar USUARIOS de prueba (staff/técnicos de prueba)
-- ON DELETE CASCADE borra también su registro en auth
-- ============================================================

DELETE FROM usuarios
WHERE correo ILIKE '%prueba%'
   OR correo ILIKE '%test%'
   OR correo IN (
     'p1pago@gmail.com', 'p2pago@gmail.com', 'p3pago@gmail.com',
     'p4pago@gmail.com', 'prp@gmail.com', 'pruebactaller@gmail.com',
     'tetaller1@gmail.com', 'juan@gmail.com', 'juan1@gmail.com',
     'juan2@gmail.com', 'ger2@gmail.com'
   );

-- ============================================================
-- PASO 3: Eliminar AUTH huérfanos de prueba
-- (registros de auth sin usuario asociado o con email de prueba)
-- ============================================================

DELETE FROM auth
WHERE correo ILIKE '%prueba%'
   OR correo ILIKE '%test%'
   OR correo IN (
     'p1pago@gmail.com', 'p2pago@gmail.com', 'p3pago@gmail.com',
     'p4pago@gmail.com', 'prp@gmail.com', 'pruebactaller@gmail.com',
     'tetaller1@gmail.com', 'juan@gmail.com', 'juan1@gmail.com',
     'juan2@gmail.com', 'ger2@gmail.com', 'cp1@gmail.com', 'cpd@gmail.com',
     'carolina1@gmail.com'
   );

-- ============================================================
-- PASO 4: Verificación final — confirmar que no quedan registros
-- ============================================================

SELECT 'clientes_prueba_restantes' AS check_name, COUNT(*) AS total
FROM clientes
WHERE nombre ILIKE '%prueba%'
   OR nombre ILIKE '%test%'
   OR apellidos ILIKE '%prueba%'
   OR apellidos ILIKE '%deleteSTE%'
   OR correo ILIKE '%prueba%'
   OR correo ILIKE '%test%'

UNION ALL

SELECT 'auth_prueba_restantes', COUNT(*)
FROM auth
WHERE correo ILIKE '%prueba%'
   OR correo ILIKE '%test%'

UNION ALL

SELECT 'usuarios_prueba_restantes', COUNT(*)
FROM usuarios
WHERE correo ILIKE '%prueba%'
   OR correo ILIKE '%test%';
