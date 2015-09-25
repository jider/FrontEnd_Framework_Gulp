# Meduxa - Mediaset User Xperience & appearance
Proyecto de Front-end para la nueva interfaz de usuario de los Sites de Mediaset


## Requisaitos previos
Antes de continuar es necesario tener instalado el siguiente software en el equipo.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Gulp](http://gulpjs.com/): Run `[sudo] npm install gulp -g`


## Inicio rápido
1. git clone git@git.tele5.int:Meduxa
2. [sudo] npm install

Para lanzar la soluciónn en modo desarrollo, ejecuta:

`gulp`

Y ya esta todo listo para empezar!!


## Tareas de Gulp
### Tareas principales de los entornos de desarrollo y producción
* `gulp` / `gulp default` - Tarea por defecto para ejecutar la solución como entorno de desarrollo.
* `gulp default:clean` - Ejecuta la solución como entorno de desarrollo pero regenerando los estáticos de **public**.
* `gulp public` - Genera los estáticos utilizados en el entorno de **desarrollo** dentro del directorio **public**.
* `gulp production` - Genera los estáticos utilizados en el entorno de **producción**, dentro del directorio **dist**.
### Tareas para la generación de Bundles
* `gulp browserify` - Genera los bundles de codigo JavaScript especificados en el fichero de configuracion **gulp/config**.
* `gulp watchify` - Wrapper de **browserify** que permite generar los bundles al vuelo, al modificar el código fuente.
### Tareas de sincronización y creación de servicios
* `gulp browserSync` - Tarea encargada de sincronizar los cambios realizados en el código fuente de la solución con el browser.
* `gulp nodemon` - Tarea encargada de levantar el servidor Node.
### Tareas de borrado
* `gulp clean` - Limpia los directorios **public** y de **distribucion**.
* `gulp clean:public` - Limpia el directorio de estáticos **public**, utilizado en el entorno de **desarrollo**.
* `gulp clean:dist` - Limpia el directorio de estáticos **dist**, utilizado en el entorno de **producción**.
* `gulp clean:js` - Limpia los scripts del directorio **public**.
### Tareas de tratamiento y optimización
* `gulp fonts` - Genera y copia las fuentes tipográficas en el directorio **public**.
* `gulp images` - Optimiza y copia las imágenes en el directorio **public**.
* `gulp sass` - Compila, optimiza y copia las el codigo **CSS** en el directorio **public**.
* `gulp markup` - Trata y copia las plantillas de los proyectos **Cliente** y **Framework** en el directorio **public**.
* `gulp markup:client` - Trata y copia las plantillas del proyecto **Cliente** en el directorio **public**.
* `gulp markup:fw` - Trata y copia las plantillas del proyecto **Framework** en el directorio **public**.
* `gulp markup:dist` - Trata y copia las plantillas a distribuir al entorno de **producción** en el directorio **dist**.
### Tareas de compilación para producción
* `gulp minifyCss` - Genera, minifica y copia el código **CSS** utilizado en el entorno de **producción**, dentro del directorio **dist**.
* `gulp uglifyJs` - Genera, minifica y copia el código **JavaScript** utilizado en el entorno de **producción**, dentro del directorio **dist**.


## Estructura de la solución 
  * `node_modules`: Dependencias de **Node** especificadas en *package.json*
  * `gulp`: Tareas de Gulp utilizadas en el proyecto.
  * `src/Client`: Proyecto de la aplicación Cliente. Show Room y estado del desarrollo.
  * `src/Framework`: Proyecto del Framework de Front-end. Nueva interfaz y módulos a utilizar en los Sites de Mediaset.
  * `src/Server`: Proyecto del servidor de **Node**. Mock del backend de producción.
  
  