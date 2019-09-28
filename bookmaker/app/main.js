const {app, BrowserWindow} = require('electron');

let mainWindow = null;

app.on("ready", ()=>{
    console.log('Hello from electron');
    mainWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration:true
        }
    });
    mainWindow.webContents.loadFile('./app/index.html');
});