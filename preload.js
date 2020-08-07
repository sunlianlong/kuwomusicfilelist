// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {ipcRenderer} = require('electron')

function say_hello(){
  var fileDirList = document.querySelector("#fileDir").files;
  var fileList = document.querySelector("#file").files;
  if(fileList.length>0&&fileDirList.length>0){
    var arr = [];
    for (let index = 0; index < fileDirList.length; index++) {
      const element = fileDirList[index];
      arr.push({
        path:element.path,
        name:element.name
      })
    }
    ipcRenderer.on('asynchronous-reply', (event, arg, arrList) => {
      document.querySelector("#file").style.display = "none";
      document.querySelector("#fileDir").style.display = "none";
      document.querySelector("#file").style.display = "block";
      document.querySelector("#fileDir").style.display = "block";
      alert("修改成功！");
    })
    ipcRenderer.send('asynchronous-message', 'ping',fileList[0].path,arr)
  }else{
    if(fileList.length>0){
      alert("请选择音乐文件夹")
    }else{
      alert("请选择db文件")
    }
  }
  
}
function init(){
  ipcRenderer.on('reply', (event, arg) => {
    console.log(arg);
  })
}
init();
window.say_hello = say_hello;