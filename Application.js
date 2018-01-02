var http        = require('http');
var exhb        = require('express-handlebars');
var config      = require('config');
var express     = require('express');
var socketIO    = require('socket.io');
var bodyParser  = require('body-parser');

/**
 * Express Application class
 *  -> Boots Express router
 *  -> Boots a Socket server for full duplex communication with UI
 */
class Application{

    constructor(){
        this._appConfig     = config.get('app');
        
        this._app           = express();
        this._exhb          = exhb.create();
        this._httpServer    = http.createServer(this._app);

        this._socketSessions = {};
    }

    boot(){
        /**
         * Boot Procedure
         *  [1]-> Boot Express instance and attach neccessary modules
         *  [2]-> Boot Socket server
         *  [3]-> Register routes and handlers
         *  [4]-> Serve application on configured port
         */
        console.log('|-> Booting Toolkit..');
        this._bootExpress()
            .then(  ()  => this._bootSocketServer())
            .then(  ()  => this._registerRoutes())
            .then(  ()  => this._serveApplication())
            .catch( (e) => console.log(e));
    }

    _bootExpress(){
        return new Promise( (resolve) => {
            /** Attach render engine [handlebars] */
            console.log('   [+]- Attaching render engine');
            this._app.engine('html', this._exhb.engine);
            this._app.set('view engine', 'handlebars');

            /** configure views folder */
            console.log('   [+]- Registering views');
            this._app.set('views','./assets/markup');

            /** All Static assets will be loaded from 'assets' directory */
            console.log('   [+]- Registering static assets');
            this._app.use(this._appConfig.contextRoot, express.static('assets'));

            /** Attach bodyparser to handle post requests */
            console.log('   [+]- Attaching body parser');
            this._app.use(bodyParser.json());
            this._app.use(bodyParser.urlencoded({extended:true}));
            resolve();
        });
    }

    _bootSocketServer(){
        return new Promise( (resolve) => {
            /**
             * [1]-> Create socket server
             * [2]-> Attach event handlers
             * [3]-> Start listening on configured port
             */
            // [1]
            console.log('   [+]- Booting Socket Server');
            this._socketServer = socketIO(this._httpServer);
            // [2]
            this._socketServer.on('connection', (client) => {
                console.log('Client connected : ' + client.id);
                this._socketSessions[client.id] = client;

                this._socketSessions[client.id].emit('ack','Connected');
                
            }).on('disconnect',() => console.log('Client disconnected'));
            // [3]
            this._socketServer.listen(this._appConfig.socketPort);
            console.log(`           +- Socket server listening on port:${this._appConfig.socketPort}`);
            resolve();
        });
    }

    _registerRoutes(){
        return new Promise( (resolve) => {
            /** Default route */
            console.log('   [+]- Registering routes');
            this._app.get(this._appConfig.contextRoot + '/', (req, res) => {
                res.render('index.html',{});
            });
            resolve();
        });
    }

    _serveApplication(){
        return new Promise( (resolve) => {
            this._app.listen(this._appConfig.port, () => {
                console.log(`|-> Application is live on port:${this._appConfig.port}`);
                resolve();
            });
        });
    }
}

new Application().boot();