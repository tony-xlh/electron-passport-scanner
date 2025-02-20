const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('Dynamsoft', {
  onCaptured: (callback) => ipcRenderer.on('update-result', (_event, value) => callback(value)),
  capture: (dataurl) => ipcRenderer.send('capture', dataurl)
})
