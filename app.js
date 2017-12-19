var restify = require('restify');
var builder = require('botbuilder');

// Levantar restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// No te preocupes por estas credenciales por ahora, luego las usaremos para conectar los canales.
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

// Ahora utilizamos un UniversalBot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Dialogos
bot.dialog('/', [
    function (session) {
        session.send("Hola te saluda Juanito el bot de la UC");
        builder.Prompts.choice(session, 'Elige la sede de la univerdad para saber los horarios de atención del Centro de Atención al usuario',
            'Huancayo|Arequipa|Cusco', { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        
        let msj = results.response.entity;
        
        if ( msj == 'Huancayo' ) {
            var tableHTML = '<table style="padding:10px;border:1px solid black;"><tr style="background-color:#c6c6c6"><th>Horario</th><th>Contacto</th><th>Ubicación</th></tr><tr><td>Lunes a viernes: 7:15 a. m. a 9:00 p. m. (horario corrido) </td><td>Central telefónica: (064) 481430 anexo: 626 Correo: centrodeatencion@continental.edu.pe</td><td>Av. San Carlos N° 1980 – Huancayo</td></tr></table>';
            var message = {
                type: 'message',
                textFormat: 'xml', 
                text: tableHTML
            };
            session.send(message);
        } else if ( msj == 'Arequipa' ) {
            session.send("arequipaaa");
            session.beginDialog('/arequipa');
        } else if ( msj == 'Cusco' ) {
            session.send("cuscoooo");
            session.beginDialog('/cusco');
        }

    }
]).cancelAction('cancelarDialogAction', 'Fue un gusto atenderte, regresa pronto', { matches: /^cancelar|salir|chau|adios$/i });

bot.dialog('/hyork', [
    function (session) {
        builder.Prompts.choice(session, '¿En qué carrera estás interesado?',
            'Medicina Humana|Ingeniería de Sistemas|Ingeniería Industrial|Ingeniería Civil|Derecho|Administración'
            , { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        let carrera = results.response.entity;
        session.endDialog(`La carrera de ${carrera} es de las mejores en el Perú.`);
    }
]);

bot.dialog('/intranet', [
    function (session) {
        builder.Prompts.text(session, '¿Cual es tu código de Alumno?');
    },
    function (session, results) {
        let codigo = results.response;
        builder.Prompts.choice(session, 'Hola :) , que servicios deseas saber',
            'Notas|Deudas|Asistencia', { listStyle: builder.ListStyle.button });
        
    },
    function (session, results) {
        let servicio = results.response.entity;
        if ( servicio == 'Notas' ){
            session.endDialog("Luego te muestro tus notas");
        } else if (servicio == 'Deudas') {
            session.endDialog("A la fecha no tienes deudas");
        } else if (servicio == 'Asistencia') {
            session.endDialog("Has asistido a todas las clases");
        }
    },
]);

bot.dialog('/sucursales', [
    function (session) {
        builder.Prompts.choice(session, 'Tenemos 4 sucursales, ¿en cual estás interesado?',
            'Lima|Huancayo|Cusco|Arequipa', { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        let place = results.response.entity;
        if ( place == 'Lima' ) {
            session.endDialog("En Lima nos encontramos en Jr. Junín 355, Miraflores");
        } else if ( place == 'Huancayo' ) {
            session.endDialog("En Huancayo nos encontramos en Av. San Carlos 1980");
        } else if ( place == 'Cusco' ) {
            session.endDialog("En Cusco nos encontramos en Av. Collasuyo S/N Urb. Manuel Prado");
        } else {
            session.endDialog("En Arequipa nos encontramos en Calle Alfonso Ugarte 607 – Yanahuara");
        }
    }
]);