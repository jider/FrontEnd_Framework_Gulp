'use strict';

/*
  
  En vez de administrar un enorme fichero que configure las tareas, 
  cada tarea se ha separado en un fichero dentro de la ruta 'gulp/tasks'.
  Cada uno de los ficheros de tarea definidos en esta carpeta se cargarán de forma automática.
  Esta separación modular de tareas nos permite compartir reutilizar los ficheros en diferentes royectos.

  Para añadir una nueva tarea, simplemente añade un nuevo fichero de tarea en el directorio 'gulp/tasks'.

  gulp/tasks/default.js especifica las tarea a ejecutar por defecto cuando lanzamos 'gulp'.

*/

var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });