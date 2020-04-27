const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const {IS_PRODUCTION, APP_ICON} = require('./config');
//const appUpdater = require('update-electron-app');
const crashReporter = require('./crush-reporter');
const helper = require('./helpers');
const log = require('electron-log');

Object.assign(console, log.functions);


function createMenu (shel, win) {
  const tmpl = require('./menu')(win, shel);
  const menu = Menu.buildFromTemplate(tmpl);

  Menu.setApplicationMenu(menu);
}

async function runMigrations() {

  try {
    if (!helper.appFolderExists()) {
      helper.createAppFolder();
    }

    await helper.migrate();
  }
  catch (error) {
    console.log(error)
  }
}


runMigrations();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  if (BrowserWindow.getAllWindows().length > 0) return;

  const mainWindow = new BrowserWindow({
    show: false,
    darkTheme: true,
    icon: APP_ICON,
    width: 1200,
    height: 780,
    minWidth: 800,
    minHeight: 533,
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: "#181818",
    titleBarStyle: 'hiddenInset',
    'standard-window': false
  });


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('enter-full-screen', () => {
    mainWindow.send('fullscreenChanged', true)
  });

  mainWindow.on('leave-full-screen', () => {
    mainWindow.send('fullscreenChanged', false)
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    if (!IS_PRODUCTION) {
      mainWindow.webContents.openDevTools();
    }
  });

  createMenu(shell, mainWindow);
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


app.once('will-finish-launching', function () {
  crashReporter.init();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
