import test from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/app';

const TEST_PORT = 3098;
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

test('1. Health Check Endpoint (/api/v1/health) responde 200 OK', async () => {
  const res = await request({ path: '/api/v1/health' });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.status, 'success');
  assert.strictEqual(res.body.message, 'ControlLabs API operando correctamente');
});

test('2. POST /api/v1/loans responde 501 Not Implemented', async () => {
  const res = await request({
    method: 'POST',
    path: '/api/v1/loans',
    body: {
      aula: 'Sala 302 TI',
      numeroPC: 20,
      mouse: 20,
      teclados: 20,
      nombreGuardaEntrega: 'Ana Perez',
      instructorRecibe: 'Carlos Ruiz',
    },
  });
  assert.strictEqual(res.statusCode, 501);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.message, 'El registro de préstamos todavía no está implementado.');
});

test('3. GET /api/v1/loans/search con query params responde 501 Not Implemented', async () => {
  const res = await request({
    method: 'GET',
    path: '/api/v1/loans/search?room=302&startDate=2026-10-01&endDate=2026-10-15',
  });
  assert.strictEqual(res.statusCode, 501);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.message, 'La consulta del historial todavía no está implementada.');
});

test('4. GET /api/v1/loans/:id con route param responde 501 Not Implemented', async () => {
  const res = await request({
    method: 'GET',
    path: '/api/v1/loans/801',
  });
  assert.strictEqual(res.statusCode, 501);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.message, 'La consulta del préstamo 801 todavía no está implementada.');
});

test('5. PUT /api/v1/loans/:id/accept con route param responde 501 Not Implemented', async () => {
  const res = await request({
    method: 'PUT',
    path: '/api/v1/loans/801/accept',
  });
  assert.strictEqual(res.statusCode, 501);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.message, 'La aceptación del préstamo 801 todavía no está implementada.');
});
