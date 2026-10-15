const fs = require('fs');
const path = require('path');

// Configurar el límite de caracteres
const limiteCaracteres = 10000; // Límite ajustado a tu necesidad

// Función para dividir texto en partes con marcas de identificación
function dividirTextoEnPartes(texto, limite, archivo) {
    const partes = [];
    const totalPartes = Math.ceil(texto.length / limite);
    let contador = 1;

    while (texto.length > 0) {
        const parte = texto.slice(0, limite);
        texto = texto.slice(limite);

        // Agregar marcas al final de cada parte
        let marca = '';
        if (contador < totalPartes) {
            marca = `\n--- Fin de la parte ${contador} del archivo "${archivo}". Parte siguiente: ${contador + 1}/${totalPartes} ---\n`;
        } else {
            marca = `\n--- Fin de la parte ${contador} del archivo "${archivo}". No hay más partes. ---\n`;
        }
        partes.push(parte + marca);
        contador++;
    }
    return partes;
}

// Función para procesar un directorio y sus subcarpetas
function procesarDirectorio(directorio) {
    const entradas = fs.readdirSync(directorio, { withFileTypes: true });
    let contenidoCompleto = '';

    entradas.forEach(entrada => {
        const rutaCompleta = path.join(directorio, entrada.name);

        if (entrada.isDirectory()) {
            // Procesar subcarpetas recursivamente
            procesarDirectorio(rutaCompleta);
        } else if (entrada.isFile() && entrada.name !== 'code_export.js') {
            // Leer el contenido del archivo
            try {
                const contenidoArchivo = fs.readFileSync(rutaCompleta, 'utf-8');
                const partes = dividirTextoEnPartes(contenidoArchivo, limiteCaracteres, entrada.name);

                // Combinar contenido de todos los archivos
                contenidoCompleto += partes.join('');
                console.log(`Archivo "${entrada.name}" procesado.`);
            } catch (error) {
                console.error(`Error al procesar el archivo ${rutaCompleta}: ${error.message}`);
            }
        }
    });

    return contenidoCompleto;
}

// Guardar el contenido combinado, asegurando el límite de caracteres
function guardarContenidoEnPartes(contenido, archivoSalida, limite) {
    const partes = dividirTextoEnPartes(contenido, limite, path.basename(archivoSalida));

    partes.forEach((parte, indice) => {
        const archivoParte = archivoSalida.replace('.txt', `_parte_${indice + 1}.txt`);
        fs.writeFileSync(archivoParte, parte);
        console.log(`Parte ${indice + 1} guardada en "${archivoParte}".`);
    });
}

// Obtener el nombre de la carpeta raíz
const directorioInicial = path.join(__dirname, '.'); // Directorio principal
const nombreCarpetaRaiz = path.basename(path.resolve(directorioInicial));
const archivoSalida = path.join(__dirname, `${nombreCarpetaRaiz}_combinado.txt`); // Nombre basado en la carpeta raíz

// Procesar el directorio y guardar el contenido combinado
const contenidoFinal = procesarDirectorio(directorioInicial);
if (contenidoFinal) {
    guardarContenidoEnPartes(contenidoFinal, archivoSalida, limiteCaracteres);
} else {
    console.log('No se encontró contenido para procesar.');
}
