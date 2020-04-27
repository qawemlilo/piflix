
const settings = require('electron-settings');
const config= require('../config');


const MenuItems = [
  'rating',
  'title',
  'year',
  'watch later'
];


module.exports.filterMenu = function (menu) {
  let id = 0;

  return MenuItems.map(function (item) {
    id += 1;
    return {
      id: id,
      label: item,
      click: (e) => {
        let filter = settings.get('settings.filter');
        let order = settings.get('settings.order');

        if (filter === item) {
          order = (order === 'asc') ? 'desc' : 'asc'
        }

        menu.filter = item;
        menu.order = order;

        settings.set('settings.order', order);
        settings.set('settings.filter', item);
      }
    }
  });
}


module.exports.mainMenu = function (shell, win, app) {
  let template = [{
    label: config.APP_NAME,
    submenu: [
      {
        label: "About Application", click: () => {
          shell.openExternal(config.HOME_PAGE_URL)
        }
      },
      {
        label: "Support", click: () => {
          shell.openExternal(config.GITHUB_URL_ISSUES)
        }
      },
      {
        label: `Check for updates (current: v${config.APP_VERSION})`, click: () => {
          shell.openExternal(config.UPDATES_URL)
        }
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function() {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Full Screen',
        type: 'checkbox',
        accelerator: process.platform === 'darwin'
          ? 'Ctrl+Command+F'
          : 'F11',
        click: () => {
          if (!win || !win.isVisible()) {
            return
          }

          let flag = win.isFullScreen();

          if (flag) {
            // Fullscreen and aspect ratio do not play well together. (Mac)
            win.setAspectRatio(0)
          }

          win.setFullScreen(flag);
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Developer',
        submenu: [
          {
            label: 'Developer Tools',
            accelerator: process.platform === 'darwin'
              ? 'Alt+Command+I'
              : 'Ctrl+Shift+I',
            click: () => {
              if (!win) return;

              if (win.webContents.isDevToolsOpened()) {
                win.webContents.closeDevTools()
              } else {
                win.webContents.openDevTools({ mode: 'detach' })
              }
            }
          }
        ]
      }
    ]
  }];

  if (process.platform === 'darwin') {
    template = [{
        label: config.APP_NAME,
        submenu: [
            {
              label: "About " +  config.APP_NAME,
              click: () => {
                shell.openExternal(config.HOME_PAGE_URL)
              }
            },
            {
              label: "Support",
              click: () => {
                shell.openExternal(config.GITHUB_URL_ISSUES)
              }
            },
            {
              label: `Check for updates (current: v${config.APP_VERSION})`,
              click: () => { shell.openExternal(config.UPDATES_URL)
              }
            },
            { type: "separator" },
            {
              label: "Quit",
              accelerator: "Command+Q",
              click: function() {
                app.quit();
              }
            }
        ]}, {
          label: "Edit",
          submenu: [
              { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
              { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
              { type: "separator" },
              { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
              { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
              { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" }
          ]}
    ];
  }

  return template;
}
