const child_process = require ("child_process");
const settings = require('electron-settings');
const log = require('electron-log');

Object.assign(console, log.functions);

module.exports.play = function (filepath) {
  let command = "open";
  let defaultPlayer = settings.get('defaultPlayer');

  if (defaultPlayer == 'vlc') {
    command = 'open -a vlc';
  }
  else if (defaultPlayer == 'quicktime') {
    command = 'open -a "QuickTime Player"';
  }

  let proc = child_process.spawn (
    command,
    ['"'+filepath+'"'],
    { shell: true }
  );

  // Handle VLC error output (from the process' stderr stream)
  proc.stderr.on ("data", (data) => {
    console.error ("VLC: " + data.toString ());
  });

  // Optionally, also handle VLC general output (from the process' stdout stream)
  proc.stdout.on ("data", (data) => {
    console.log ("VLC: " + data.toString ());
  });

  // Finally, detect when VLC has exited
  proc.on ("exit", (code, signal) => {
    console.log ("VLC exited with code " + code);
  });
}
