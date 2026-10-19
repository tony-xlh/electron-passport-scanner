const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { LicenseManager, CaptureVisionRouter } = require('dynamsoft-capture-vision-for-node');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  ipcMain.on('capture', async (event, dataurl) => {
    const webContents = event.sender
    console.log(webContents);
    const result = await capture(dataurl);
    console.log(result);
    webContents.send('update-result', result);
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

initDCV();

function initDCV(){
  LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9');

  // Load the MRZ templates that ship with the npm package. They define the
  // ReadPassport / ReadId / ReadVisa templates and declare the models
  // (MRZLocalization, MRZCharRecognition, ...) those templates need.
  const packageRoot = path.dirname(
    path.dirname(require.resolve('dynamsoft-capture-vision-for-node'))
  );
  CaptureVisionRouter.initSettings(path.join(packageRoot, 'Templates', 'MRZScanner.json'));
}

async function capture(dataurl){
  let response = await fetch(dataurl);
  let bytes = await response.bytes();
  let result = await CaptureVisionRouter.captureAsync(bytes, "ReadPassport");
  let jsonStr = "";
  if (result.parsedResultItems.length > 0) {
    let parsedResultItem = result.parsedResultItems[0];
    jsonStr = JSON.stringify(parsedResultItem.parsed);
  }
  return jsonStr;
}
