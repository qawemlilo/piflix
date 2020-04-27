"use strict"

const config = require('./config');

module.exports = function (win, shell) {
  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
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
            if (!win) {
              return
            }

            let flag = !!win.isFullScreen();

            if (flag) {
              // Fullscreen and aspect ratio do not play well together. (Mac)
              win.setAspectRatio(0)
            }

            win.setFullScreen(!flag);
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Go Back',
          accelerator: 'Esc',
          click: () => win.dispatch('escapeBack')
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
              click: () => win.toggleDevTools({ mode: 'detach' })
            }
          ]
        }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn more about ' + config.APP_NAME,
          click: () => {
            shell.openExternal(config.HOME_PAGE_URL)
          }
        },
        {
          label: 'Release Notes',
          click: () => {
            shell.openExternal(config.GITHUB_URL_RELEASES)
          }
        },
        {
          label: 'Contribute on GitHub',
          click: () => {
            shell.openExternal(config.GITHUB_URL)
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Report an Issue...',
          click: () => {
            shell.openExternal(config.GITHUB_URL_ISSUES)
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    // WebTorrent menu (Mac)
    template.unshift({
      label: config.APP_NAME,
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Preferences',
          accelerator: 'Cmd+,',
          click: () => win.send('preferences')
        },
        {
          type: 'separator'
        },
        {
          role: 'services'
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })

    // Edit menu (Mac)
    template[2].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Speech',
        submenu: [
          {
            role: 'startspeaking'
          },
          {
            role: 'stopspeaking'
          }
        ]
      }
    )

    // Window menu (Mac)
    template.splice(6, 0, {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          type: 'separator'
        },
        {
          role: 'front'
        }
      ]
    })
  }

  return template;
}
