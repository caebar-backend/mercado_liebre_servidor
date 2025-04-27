import { createServer } from 'http'
import { readFile } from 'fs'
import { join, dirname } from 'path'
import { getContentType } from './getContentType.js'
import { fileURLToPath } from 'url'
import { configDotenv } from 'dotenv'

import color from 'ansi-colors';

const dotenv = configDotenv()


// Configuración de rutas del sistema de archivos
const __filename = fileURLToPath(import.meta.url) // Obtener ruta del archivo actual
const __dirname = dirname(__filename) // Obtener ruta de la carpeta actual

// Creación del servidor HTTP
const server = createServer((req, res) => {
  const { method, url } = req

  // Manejo de solicitudes GET
  if (method === 'GET') {
    if (url === '/' || url === '/home' || url === '/home.html') {
      // TODO: Servir el archivo home.html desde la carpeta views
      // 1. Usar readFile para leer el archivo
      // 2. Establecer el Content-Type correcto
      // 3. Enviar el contenido al cliente
      const filePath = join(__dirname, 'views', 'home.html')
      readFile(filePath, (error, datos) => {
        if(error){
          res.writeHead(500)
          return res.end('Error: No se puede cargar el archivo home.html')
        }
        res.writeHead(200, { 'content-type': 'text/html' } )
        res.end(datos)
      })
    
    } else if (url === '/login' || url === '/login.html') {
      // TODO: Servir el archivo login.html desde la carpeta views
      // 1. Usar readFile para leer el archivo
      // 2. Establecer el Content-Type correcto
      // 3. Enviar el contenido al cliente
      const filePath = join(__dirname, 'views', 'login.html')
      readFile(filePath, (error, datos) => {
      if(error){
        res.writeHead(500)
        return res.end(`Error: No se puede cargar el archivo login.html`)
      }
      res.writeHead(200, { 'content-type': 'text/html'} )
      res.end(datos)
    })
    } else if (url === '/register' || url === '/register.html') {
      // TODO: Servir el archivo register.html desde la carpeta views
      // 1. Usar readFile para leer el archivo
      // 2. Establecer el Content-Type correcto
      // 3. Enviar el contenido al cliente
      const filePath = join(__dirname, 'views', 'register.html')
      readFile(filePath, (error, datos) => {
        if(error){
          res.writeHead(500)
          return res.end('Error: No se puede cargar el archivo register.html')
        }
        res.writeHead(200, { 'content-type': 'text/html' })
        res.end(datos)
      })
    } else {
      // TODO: Servir archivos estáticos desde la carpeta public (imágenes y CSS)
      // 1. Usar join para construir la ruta del archivo
      // 2. Usar readFile para leer el archivo
      // 3. Establecer el Content-Type usando getContentType
      // 4. Enviar el contenido al cliente
      const filePath = join(__dirname, 'public', url)
      readFile(filePath, (error, datos) => {
        if(error){
          res.writeHead(404)
          return res.end('ERROR: Archivo no hallado!!')
        }
        const contentType = getContentType(filePath)
        res.writeHead(200, { 'content-type': contentType })
        res.end(datos)
      })
    }
  }
  // Manejo de solicitudes POST
  else if (method === 'POST') {
    if (url === '/login' || url === '/register') {
      // TODO: Redirigir al usuario a la página de inicio
      // 1. Establecer el código de estado 302
      // 2. Establecer el header Location: '/'
      // 3. Finalizar la respuesta
      res.writeHead(302, { 'location': '/'})
      res.end()
    } else {
      // Enviar respuesta 404 para rutas POST no válidas
      res.writeHead(404)
      res.end('Ruta no encontrada')
    }
  }
})

// Configuración del puerto del servidor
const localhost = process.env.LOCALHOST
const puerto = process.env.PORT ?? 3002
server.listen(puerto, () => {
  console.log(color.bgYellow(`Servidor corriendo en http://${localhost}:${puerto}`))
  console.log(color.cyanBright(`home.html -------> http://${localhost}:${puerto}/home.html`))
  console.log(color.magentaBright(`regiter.html ----> http://${localhost}:${puerto}/register.html`))
  console.log(color.greenBright(`login.html -------------> http://${localhost}:${puerto}/login.html`))
})
