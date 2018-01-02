/**
 * UI operations handler
 */

var socket;
var ui = {

    onload : () => {
        socket = io('http://localhost:9087');

        socket.on('ack', () => {
            console.log('Socket connection established');
        })

        $('#cryptoPrices').show();

        
    },

    showTab :   (tabId) => {
        $('.tabContentHolder').hide();
        $('#' + tabId).show();
    }

};