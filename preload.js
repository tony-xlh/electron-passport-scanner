const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('Dynamsoft', {
  capture: (dataurl) => ipcRenderer.send('capture', dataurl)
})
