const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../src/app');

// Puerto dinámico para pruebas
const TEST_PORT = 3099;
let server;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, resolve);
  });
});

test.after(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

function request({ method = 'GET', path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      ...headers,
      'Content-Type': 'application/json',
    };
    if (payload) {
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
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
              headers: res.headers,
              body: responseData ? JSON.parse(responseData) : null,
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
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

test('1. Health Check Endpoint (/api/v1/health)', async () => {
  const res = await request({ path: '/api/v1/health' });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.status, 'success');
  assert.strictEqual(res.body.message, 'ControlLabs API operando correctamente');
});

test('2. HU-01: Autenticación con Google y JWT para Guarda e Instructor', async () => {
  // Login Guarda
  const guardaRes = await request({
    method: 'POST',
    path: '/api/v1/auth/google',
    body: {
      email: 'carlos.guarda@seguridadsena.gov.co',
      name: 'Carlos Mendoza Guarda',
    },
  });
  assert.strictEqual(guardaRes.statusCode, 200);
  assert.ok(guardaRes.body.data.token, 'Debe retornar un token JWT');
  assert.strictEqual(guardaRes.body.data.user.role, 'GUARDA');

  // Login Instructor
  const instructorRes = await request({
    method: 'POST',
    path: '/api/v1/auth/google',
    body: {
      email: 'sgomez@misena.edu.co',
      name: 'Sandra Gómez Instructora',
    },
  });
  assert.strictEqual(instructorRes.statusCode, 200);
  assert.ok(instructorRes.body.data.token, 'Debe retornar un token JWT');
  assert.strictEqual(instructorRes.body.data.user.role, 'INSTRUCTOR');
});

test('3. HU-02: Registro de préstamo de sala con los 11 campos (Rol Guarda)', async () => {
  // Obtenemos token del Guarda
  const login = await request({
    method: 'POST',
    path: '/api/v1/auth/login',
    body: { email: 'carlos.guarda@seguridadsena.gov.co', role: 'GUARDA' },
  });
  const token = login.body.data.token;

  // Creamos el préstamo con los 11 campos oficiales
  const loanPayload = {
    aula: 'Sala 302 TI',
    numeroPC: 32,
    mouse: 32,
    teclados: 32,
    cargador: 32,
    fechaHoraRecibido: new Date().toISOString(),
    numeroTVs: 1,
    controlTV: true,
    instructorRecibe: 'sgomez@misena.edu.co',
    telefono: '3205557890',
    nombreGuardaEntrega: 'Carlos Mendoza',
    observaciones: 'Todo el cableado organizado.',
  };

  const res = await request({
    method: 'POST',
    path: '/api/v1/loans',
    headers: { Authorization: `Bearer ${token}` },
    body: loanPayload,
  });

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.estado, 'PENDIENTE_APROBACION');
  assert.strictEqual(res.body.data.aula, 'Sala 302 TI');
  assert.strictEqual(res.body.data.numeroPC, 32);
});

test('4. HU-03: Aceptación de inventario físico (Rol Instructor)', async () => {
  // 1. Guarda crea préstamo
  const loginGuarda = await request({
    method: 'POST',
    path: '/api/v1/auth/login',
    body: { email: 'carlos.guarda@seguridadsena.gov.co', role: 'GUARDA' },
  });
  const guardaToken = loginGuarda.body.data.token;

  const createRes = await request({
    method: 'POST',
    path: '/api/v1/loans',
    headers: { Authorization: `Bearer ${guardaToken}` },
    body: {
      aula: 'Sala 401 Multimedia',
      numeroPC: 25,
      mouse: 25,
      teclados: 25,
      cargador: 25,
      fechaHoraRecibido: new Date().toISOString(),
      numeroTVs: 1,
      controlTV: true,
      instructorRecibe: 'sgomez@misena.edu.co',
      telefono: '3205557890',
      nombreGuardaEntrega: 'Carlos Mendoza',
    },
  });
  const loanId = createRes.body.data.id;

  // 2. Instructor inicia sesión y acepta
  const loginInstructor = await request({
    method: 'POST',
    path: '/api/v1/auth/login',
    body: { email: 'sgomez@misena.edu.co', role: 'INSTRUCTOR' },
  });
  const instructorToken = loginInstructor.body.data.token;

  const acceptRes = await request({
    method: 'PUT',
    path: `/api/v1/loans/${loanId}/accept`,
    headers: { Authorization: `Bearer ${instructorToken}` },
    body: {
      observaciones: 'Verificado personalmente en salón de formación.',
      firmaDigital: 'FIRMA_DIGITAL_INSTRUCTOR_SENA_SGOMEZ',
    },
  });

  assert.strictEqual(acceptRes.statusCode, 200);
  assert.strictEqual(acceptRes.body.data.estado, 'APROBADO_Y_FIRMADO');
  assert.ok(acceptRes.body.data.fechaAceptacion);
});

test('5. HU-04: Consulta de Historial con Filtros por Salón y Fechas', async () => {
  const login = await request({
    method: 'POST',
    path: '/api/v1/auth/login',
    body: { email: 'admin.adso@misena.edu.co', role: 'ADMIN' },
  });
  const token = login.body.data.token;

  const res = await request({
    method: 'GET',
    path: '/api/v1/loans/history?room=301',
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(Array.isArray(res.body.data));
});

test('6. HU-04: Dashboard y Métricas en Tiempo Real', async () => {
  const login = await request({
    method: 'POST',
    path: '/api/v1/auth/login',
    body: { email: 'admin.adso@misena.edu.co', role: 'ADMIN' },
  });
  const token = login.body.data.token;

  const res = await request({
    method: 'GET',
    path: '/api/v1/dashboard/metrics',
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.data.kpis);
  assert.ok(res.body.data.inventarioFisicoEnUsoHoy);
});
