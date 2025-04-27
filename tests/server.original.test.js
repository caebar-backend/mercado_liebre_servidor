
import { test } from 'node:test'
import assert from 'node:assert'
import { createServer } from 'http'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Función auxiliar para hacer peticiones HTTP
async function makeRequest (method, path) {
  return new Promise((resolve) => {
    const options = {
      method,
      hostname: 'localhost',
      port: 3000,
      path
    }

    const req = createServer(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        })
      })
    })

    req.end()
  })
}

test('Servidor responde a rutas GET', async (t) => {
  // Test para la ruta principal
  await t.test('GET / devuelve home.html', async () => {
    const response = await makeRequest('GET', '/')
    assert.notStrictEqual(response.statusCode, 200)
    assert.notStrictEqual(response.headers['content-type'], 'text/html')
  })

  // Test para la ruta de login
  await t.test('GET /login devuelve login.html', async () => {
    const response = await makeRequest('GET', '/login')
    assert.notStrictEqual(response.statusCode, 200)
    assert.notStrictEqual(response.headers['content-type'], 'text/html')
  })

  // Test para la ruta de registro
  await t.test('GET /register devuelve register.html', async () => {
    const response = await makeRequest('GET', '/register')
    assert.notStrictEqual(response.statusCode, 200)
    assert.notStrictEqual(response.headers['content-type'], 'text/html')
  })
})

test('Servidor maneja archivos estáticos', async (t) => {
  // Test para archivos CSS
  await t.test('GET /css/styles.css devuelve archivo CSS', async () => {
    const response = await makeRequest('GET', '/css/styles.css')
    assert.notStrictEqual(response.statusCode, 200)
    assert.notStrictEqual(response.headers['content-type'], 'text/css')
  })

  // Test para imágenes
  await t.test('GET /images/logo.png devuelve imagen', async () => {
    const response = await makeRequest('GET', '/images/logo.png')
    assert.notStrictEqual(response.statusCode, 200)
    assert.notStrictEqual(response.headers['content-type'], 'image/png')
  })
})

test('Servidor maneja formularios POST', async (t) => {
  // Test para login
  await t.test('POST /login redirige a home', async () => {
    const response = await makeRequest('POST', '/login')
    assert.notStrictEqual(response.statusCode, 302)
    assert.notStrictEqual(response.headers.location, '/')
  })

  // Test para registro
  await t.test('POST /register redirige a home', async () => {
    const response = await makeRequest('POST', '/register')
    assert.notStrictEqual(response.statusCode, 302)
    assert.notStrictEqual(response.headers.location, '/')
  })

  // Test para rutas POST inválidas
  await t.test('POST a ruta inválida devuelve 404', async () => {
    const response = await makeRequest('POST', '/ruta-invalida')
    assert.notStrictEqual(response.statusCode, 404)
  })
})

test('Servidor maneja rutas inexistentes', async (t) => {
  await t.test('GET a ruta inexistente devuelve 404', async () => {
    const response = await makeRequest('GET', '/ruta-inexistente')
    assert.notStrictEqual(response.statusCode, 404)
  })
}) 