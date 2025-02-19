window.onload = async function(){
  await askForPermissions();
  listDevices();
  document.getElementById("button-start").addEventListener("click",startScanning);
}

async function askForPermissions(){
  var stream;
  try {
    var constraints = {video: true, audio: false}; //ask for camera permission
    stream = await navigator.mediaDevices.getUserMedia(constraints);  
  } catch (error) {
    console.log(error);
  }
  closeStream(stream);
}

function closeStream(stream){
  try{
    if (stream){
      stream.getTracks().forEach(track => track.stop());
    }
  } catch (e){
    alert(e.message);
  }
}

var devices;
var camSelect = document.getElementById("select-camera");

async function listDevices(){
  devices = await getCameraDevices()
  for (let index = 0; index < devices.length; index++) {
    const device = devices[index];
    camSelect.appendChild(new Option(device.label ?? "Camera "+index,device.deviceId));
  }
}

async function getCameraDevices(){
  await askForPermissions();
  var allDevices = await navigator.mediaDevices.enumerateDevices();
  var cameraDevices = [];
  for (var i=0;i<allDevices.length;i++){
    var device = allDevices[i];
    if (device.kind == 'videoinput'){
      cameraDevices.push(device);
    }
  }
  return cameraDevices;
}

function startScanning(){
  var video = document.getElementById("camera");
  var selectedCamera = camSelect.selectedOptions[0].value;
  var constraints = {
    audio:false,
    video:true
  }
  if (selectedCamera) {
    constraints = {
      video: {deviceId: selectedCamera},
      audio: false
    }
  }
  navigator.mediaDevices.getUserMedia(constraints).then(function(camera) {
    video.srcObject = camera;
  }).catch(function(error) {
    alert('Unable to capture your camera. Please check console logs.');
    console.error(error);
  });
}
