import test from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/app';

const TEST_PORT = 3097;
let server: http.Server;

test.before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(TEST_PORT, () => resolve());
  });
});

test.after(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

function request({ method = 'GET', path, headers = {}, body = null }: {
  method?: string;
  path: string;
  headers?: Record<string, string>;
  body?: any;
}): Promise<{ statusCode: number | undefined; body: any }> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders: Record<string, string> = {
      ...headers,
      'Content-Type': 'application/json',
    };
    if (payload) {
      reqHeaders['Content-Length'] = Buffer.byteLength(payload).toString();
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: TEST_PORT,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              body: responseData ? JSON.parse(responseData) : null,
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              body: responseData,
            });
          }
        });
      }
    );

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

// ----------------------------------------------------
// 1. MÓDULO: GESTIÓN DE USUARIOS
// ----------------------------------------------------
test('1.1. GET /api/v1/users - Listar usuarios', async () => {
  const res = await request({ path: '/api/v1/users' });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(Array.isArray(res.body.data));
});

test('1.2. POST /api/v1/users - Registrar nuevo usuario con perfil', async () => {
  const res = await request({
    method: 'POST',
    path: '/api/v1/users',
    body: {
      name: 'Estudiante Nuevo ADSO',
      email: 'aprendiz.test@misena.edu.co',
      role: 'estudiante',
      phone: '3101112233',
    },
  });
  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.role, 'estudiante');
  assert.strictEqual(res.body.data.status, 'ACTIVO');
});

test('1.3. GET /api/v1/users/:id - Consultar usuario por ID', async () => {
  const res = await request({ path: '/api/v1/users/usr-docente-1' });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.id, 'usr-docente-1');
});

test('1.4. PATCH /api/v1/users/:id - Actualización parcial (rol, estado, password)', async () => {
  const res = await request({
    method: 'PATCH',
    path: '/api/v1/users/usr-estudiante-1',
    body: {
      role: 'docente',
      status: 'ACTIVO',
      password: 'NuevaClaveSegura2026',
    },
  });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.role, 'docente');
  assert.strictEqual(res.body.data.password, 'NuevaClaveSegura2026');
  assert.ok(res.body.camposActualizados.includes('role'));
});

test('1.5. DELETE /api/v1/users/:id - Eliminación lógica (baja)', async () => {
  const res = await request({
    method: 'DELETE',
    path: '/api/v1/users/usr-estudiante-1',
  });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.status, 'INACTIVO');
});

// ----------------------------------------------------
// 2. MÓDULO: GESTIÓN DE AMBIENTES (LABORATORIOS / SALAS)
// ----------------------------------------------------
test('2.1. GET /api/v1/rooms - Listar ambientes físicos y laboratorios', async () => {
  const res = await request({ path: '/api/v1/rooms' });
  assert.strictEqual(res.statusCode, 200);
  assert.ok(Array.isArray(res.body.data));
});

test('2.2. POST /api/v1/rooms - Crear ambiente con capacidad y ubicación', async () => {
  const res = await request({
    method: 'POST',
    path: '/api/v1/rooms',
    body: {
      name: 'Laboratorio de Inteligencia Artificial',
      capacity: 35,
      location: 'Bloque A - Piso 2',
    },
  });
  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.capacity, 35);
  assert.strictEqual(res.body.data.location, 'Bloque A - Piso 2');
});

test('2.3. PATCH /api/v1/rooms/:id - Modificar parcialmente capacidad o estado vía PATCH', async () => {
  const res = await request({
    method: 'PATCH',
    path: '/api/v1/rooms/SALA-301',
    body: {
      capacity: 40,
      status: 'MANTENIMIENTO',
    },
  });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.capacity, 40);
  assert.strictEqual(res.body.data.status, 'MANTENIMIENTO');
  assert.ok(res.body.atributosModificados.includes('capacity'));
});

// ----------------------------------------------------
// 3. MÓDULO: GESTIÓN DE EQUIPOS (HARDWARE / ACTIVOS)
// ----------------------------------------------------
test('3.1. POST /api/v1/equipments - Registrar equipo vinculado a ambiente', async () => {
  const res = await request({
    method: 'POST',
    path: '/api/v1/equipments',
    body: {
      serial: 'SN-TEST-12345',
      brand: 'HP',
      model: 'EliteDesk 800 G5',
      roomId: 'SALA-302',
      type: 'PC',
    },
  });
  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.data.serial, 'SN-TEST-12345');
  assert.strictEqual(res.body.data.roomId, 'SALA-302');
  assert.strictEqual(res.body.data.technicalStatus, 'OPERATIVO');
});

test('3.2. GET /api/v1/equipments - Listar equipos y filtrar por ambiente', async () => {
  const res = await request({ path: '/api/v1/equipments?room=301' });
  assert.strictEqual(res.statusCode, 200);
  assert.ok(Array.isArray(res.body.data));
});

test('3.3. PATCH /api/v1/equipments/:id - Actualizar estado técnico vía PATCH', async () => {
  const res = await request({
    method: 'PATCH',
    path: '/api/v1/equipments/EQ-PC-001',
    body: {
      technicalStatus: 'EN_MANTENIMIENTO',
      location: 'Taller de Mantenimiento TI',
    },
  });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.data.technicalStatus, 'EN_MANTENIMIENTO');
  assert.strictEqual(res.body.data.location, 'Taller de Mantenimiento TI');
  assert.ok(res.body.atributosModificados.includes('technicalStatus'));
});
