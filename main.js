// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
let mainWindow;
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

var sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const {ipcMain} = require('electron')//监听web page里发出的message

function log(params) {
  mainWindow.webContents.send('reply',params);
}
ipcMain.on('asynchronous-message', (event, arg, dbPath, dirList) => {
  log("收到通知")
  var db = new sqlite3.Database(dbPath);
  db.all("select * from musicResource", function (err, row) {
    let mkdir = dirList[0].path.split(path.sep);
    mkdir.pop();
    mkdir = mkdir.join(path.sep)
    log("文件夹："+mkdir)
    for (let index = 0; index < dirList.length; index++) {
      const element = dirList[index];
      
      var file = fs.readFileSync(element.path);
      for (let el = 0; el < row.length; el++) {
        const dbFile = row[el];
        if(element.path.indexOf(dbFile.file) > -1){
          fs.renameSync(element.path,path.join(mkdir,dbFile.artist+'-'+dbFile.title+"."+dbFile.format));
          break;
        }
      };
    }
    event.sender.send('asynchronous-reply', "修改成功")//在main process里向web page发出message
  });
  
})



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
