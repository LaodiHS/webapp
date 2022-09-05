// const Rsync = require('rsync');
// const node_ssh = require('node-ssh');
// const ssh = new node_ssh();
// const sshc = new node_ssh();
const fs = require('fs');
const path = require('path');
// const proxy = require('express-http-proxy');
// const express = require('express');
// const app = express();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// var rsync = new Rsync ()
// .shell('ssh')
// .flags('az')
// .source(__dirname+'/app')
// .destination('bricata:127.0.0.1:1022/var/www/bricata/cmcgui-client/dist')


// rsync.execute((error, code,cmd)=>{
//     console.info('error',error)
//     console.info('success', cmd)
// })


// 'rsync -o ControlMaster=auto -v -e "ssh -p 1022" /C/Users/HasanSeirafi/Documents/bricata/cmc/src/92-cmcgui-client/app/*  bricata@127.0.0.1:1022:~/var/www/bricata/cmcgui-client/dist'

// ssh build -t "cd /home/debian/Desktop/bricata_master/bricata; sudo ./bootstrap.sh -j4 -B iso-hybrid -b CMC -b VMsmall -b VMware; bash --login"

//sudo service rested restart

//'cat /c/Users/HasanSeirafi/.ssh/cmcKey.pub | ssh -p 1022 bricata@127.0.0.1 "cat >> /etc/ssh/authorized_keys"'

//'chmod u+xr, go-rwx /etc/ssh -f'

//ssh build -t "cd /home/debian/Desktop/bricata_master/bricata; bash --login"

// copy ssh id to remmote box
//'cat /c/Users/.../.ssh/cmckey.pub | ssh -p 1022@127.0.0.1 "cat >>/etc/ssh/authirized_keys"'

//unzip
//'tar -xvf rsync-3.1.2.tar.gz'


// read out logg
// sudo tail -f /var/log/syslog
// scp -r debian@192.168.43.6:/home/debian/Desktop/bricata_master/bricata/package_CMC_3.2.0.tgz .

//'scp debian@192.168.0.4:/home/debian/Desktop/work/bricata/package_CMC_3.2.0.tgz .'

// const { exec } = require('child_process');
// exec('scp -p 1022" /C/Users/HasanSeirafi/Documents/bricata/cmc/src/92-cmcgui-client/app/*  bricata@127.0.0.1:1022:~/var/www/bricata/cmcgui-client/dist', (err, stdout, stderr) => {
//   if (err) {
//     // node couldn't execute the command
//     return  err;
//   }

//   // the *entire* stdout and stderr (buffered)
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
// });


// stringPath

// let js=[];

// function grabJs(route){
// route

//     const drill= path =>{

//         const dir = fs.readdirSync(path)

// console.log(dir)

//          dir.forEach(file =>{

//  if(file.includes('.js')){

//     file
// js.push(file)
//     }


// console.log(path +'\\'+ file)
// console.log(fs.statSync(path +'\\'+ file).isDirectory())

//  if (!file !=='fonts' && fs.statSync(path +'\\'+ file).isDirectory()){

//     path +='\\'+file;

//     path

// drill(path)
//     }


//  })

//     }


//     const dir = fs.readdirSync(route)
//     dir.forEach(file =>{
//     route
// file

//     if (fs.statSync( route +'\\'+file).isDirectory()){
//  route +='\\' +file


//          drill(route)


//      }

// })


// }


// stringPath

// grabJs(stringPath)


// js


// const read = dir =>
//   fs
//     .readdirSync(dir)
//     .reduce(
//       (files, file) =>
//         fs.statSync(path.join(dir, file)).isDirectory()
//           ? files.concat(read(path.join(dir, file)))
//           : files.concat(path.join(dir, file)),
//       []
//     );
//     let string = path.join(__dirname, "/app/scripts");
//
//     let  js = read(string).filter(x => x.endsWith(".js"));
//      js = js.map(x=> x.split('app')[1].replace(/\\/g, '/'));
//
//
//
//
//
//
//
//
// // console.log(js)
//
// // string;
//
//
// js.sort((a,b)=> {
//      a=  a.split('/').pop();
//      b=  b.split('/').pop()
//
//
//      return a.localeCompare(b);
//     }  )
//
//
// js = js.map(x=> `<script src="/static${x}"></script>`).join(',')
//
//
//
//
//  console.log(js);


// const minifier = require( 'minifier/');


// let input = __dirname + '/app/scripts'

// minifier.on('error', function(err) {
// console.log(err)
// })
// minifier.minify(input,{ouput:__dirname +'app/builder'})


// /var/www/bricata/cmcgui-client/dist/templates/sensors


//rsync --recursive -o ControlMaster=auto -v -e ssh  /C/Users/HasanSeirafi/Documents/bricata/cmc/src/90-rest-api/src/*  debian@192.168.43.6:/home/debian/Desktop/bricata_master/bricata/cmc/src/90-rest-api/src
// ssh build -t "cd /home/debian/Desktop/bricata_master/bricata; sudo ./bootstrap.sh -j4 -B iso-hybrid -b CMC -b VMsmall -b VMware; bash --login"

//build task for cmc
//start

// !#/bin/bash

// set -x #eco on

// scp debian@192.168.0.4:/home/debian/Desktop/work/bricata/package_CMC_3.2.0.tgz .

// tar zxvf package_CMC_3.2.0.tgz -C .

// cd CMCVMare

// sudo ./install.sh

// sudo chmod -R 0777 /var/www/bricata/cmcgui-client/dist

// sudo chmod -R 0777 /usr/bricat/bin

// cd ..

// rm -rf CMC
//end


// build iso ./bootstrap.sh -j4 -B iso-hybrid -b CMC -b VMsmall -b VMware


//app.use("/public2", express.static(__dirname + "/test"));


//sudo ./build.sh -j4 cmc

//git@bitbucket.org:bricata/bricata.git


// var rsync = new Rsync.build({}).shell('ssh')
// // .patterns(['-git',{action:'+', pattern:'/'}])
//     .flags({ssh: true})
//     .source(`/C/Users/HasanSeirafi/Documents/bricata/cmc/src/90-rest-api/src/*`)
//     .destination('build:/home/debian/Desktop/bricata_master/bricata/cmc/src/90-rest-api/src')
// console.log(rsync.command())
// rsync.execute(function (error, code, cmd) {
//         console.info('error', error);
//         console.info('success', code);
//         code === 0 ? ssh.connect({
//             host: '192.168.43.6',
//             username: 'debian',
//             privateKey: 'c:/Users/HasanSeirafi/.ssh/cmcKey'
//         }).then(function (result) {
//             ssh.execCommand('sudo ./build.sh CMC', {cwd: '/home/debian/Desktop/bricata_master/bricata'}).then(function (afterbuild) {
//                 console.log('done build')
//                 ssh.execCommand('kill -SIGINT').then(function (waba) {
//                     console.log('waba', waba);
//
//                     console.log('done copy')
//                     // scp -3 -r build:/home/debian/Desktop/bricata_master/bricata/package_CMC_3.2.0.tgz cmc
//                     const util = require('util');
//                     const exec = util.promisify(require('child_process').exec);
//
//                     async function ls() {
//                         const {stdout, stderr} = await exec('scp -3 -r build:/home/debian/Desktop/bricata_master/bricata/package_CMC_3.2.0.tgz cmc:/home/bricata');
//                         sshc.connect({
//                             host: '127.0.0.1',
//                             port: '1022',
//                             username: 'bricata',
//                             privateKey: 'c:/Users/HasanSeirafi/.ssh/cmcKey'
//                         }).then(result => {
//
//                             sshc.execCommand('sudo ./run').then(x => {
//                                 console.log('result of untar', x);
//                                     sshc.execCommand('sudo service rested restart').then(x => {
//                                         console.log('result of cd', x);
//
//
//                                     })
//                                 }
//                             )
//                             // console.log('result', result);
//                         })
//                         console.log('stdout:', stdout);
//                         console.log('stderr:', stderr);
//                     }
//
//                     ls();
//
//
//                 })
//
//
//             })
//
//
//         }) : null
//
//     }, function (data) {
//         //  console.log('data', data)
//         // do things like parse progress
//     }, function (data) {
//         console.log('error', data);
//         // do things like parse error output
//     }
// );
//

//
// var quitting = function() {
//     if (rsyncPid) {
//         rsyncPid.kill();
//     }
//     process.exit();
// }
// process.on("SIGINT", quitting); // run signal handler on CTRL-C
// process.on("SIGTERM", quitting); // run signal handler on SIGTERM
// process.on("exit", quitting); // run signal handler when main process exits

// console.log('dir',path.join(__dirname,'src/golang.org'));
// const golang=  path.join(__dirname,'src/golang.org/*')
// var rsyncPid = new Rsync.build({}).shell('ssh')
//     .exclude([golang])
//     .flags({ssh: true})
//     .source(`/c/Users/HasanSeirafi/Documents/bricata/cmc/src/90-rest-api/src/github.com/*`)
//     .destination('build:/home/debian/Desktop/bricata_master/bricata/cmc/src/90-rest-api/src/github.com')
// console.log(rsyncPid.command())
// rsyncPid.execute(function (error, code, cmd) {
//         console.info('error', error);
//         console.info('success', code);
//         code === 0 ? ssh.connect({
//             host: '192.168.56.101',
//             username: 'debian',
//             privateKey: 'c:/Users/HasanSeirafi/.ssh/cmcKey'
//         }).then(function (result) {
//             ssh.execCommand('sudo ./build.sh', {cwd: '/home/debian/Desktop/bricata_master/bricata/cmc/src/90-rest-api'}).then(function (afterbuild) {
//                 console.log('done build', afterbuild)
//                 // console.log('go build success/fail:', build);
//                 const util = require('util');
//                 const exec = util.promisify(require('child_process').exec);
//                 sshc.connect({
//                     host: '127.0.0.1',
//                     port: '1022',
//                     username: 'bricata',
//                     privateKey: 'c:/Users/HasanSeirafi/.ssh/cmcKey'
//                 }).then(x => {
//                     //console.log('connect to cmc', x);
//                     sshc.execCommand('sudo chmod -R 0777 /usr/bricata/bin').then(x => {
//                          console.log('enable /user/bricata/bin route for building', x);
//                         sshc.execCommand('sudo service rested stop').then(x => {
//                             console.log('stop the server', x)
//                             async function ls() {
//                                 const {stdout, stderr} = await exec('scp -3 -r build:/home/debian/Desktop/bricata_master/bricata/cmc/src/90-rest-api/bin/rested cmc:/usr/bricata/bin/');
//                                 console.log('success:', stdout);
//                                 console.log('err:', stderr);
//                                 await sshc.execCommand('sudo service rested start').then(x => {
//                                     console.log('restart the api...', x)
//                                     sshc.execCommand('exit').then(x => {
//                                         ssh.execCommand('exit').then(x => {
//                                             console.log('exit',x)
//                                         })
//                                     })
//                                 })
//                             }
//                             ls();
//                         })
//                     })
//                 })
//             }).then(data => {
//                 console.log('ssh', data)
//             })
//         }) : null

//     }, function (data) {
//         // do things like parse progress
//     }, function (data) {
//         console.log('error', data);
//     }
// );

// let route= path.join(__dirname,'/compile')

// let a  = fs.statSync().isDirectory()
// if(a){
// const dir = fs.readdirSync(route)
// while(dir.length){

// dir.pop()


// }


// }
//     dir.forEach(file =>{
function execShellCommand(cmd) {
    const exec = require("child_process").exec;
    return new Promise((resolve, reject) => {
      exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
        } else if (stdout) {
          console.log(stdout); 
        } else {
          console.log(stderr);
        }
        resolve(stdout ? true : false);
      });
    });
  }

// let arguments = process.argv
// const arg={}
// while(arguments.length > 1)arg[arguments.pop()]=1;

// const execution = {
//   "compile":  execShellCommand("node compile.js"),
//   "deploy": execShellCommand("cd compile")
// }

// for(let key in arg)execution[key];


const util = require('util');
// const exec = util.promisify(require('child_process').exec);

const { exec } = require("child_process");
function excute(url){
exec(url, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    if(!stdout){
      excute("chdir")
    }

});

}
let p =path.join(__dirname,'/compile')
excute("runas /user:\administrator cd C:/Users/dickcata/Desktop/resume/compile")

// let pathl =path.join(__dirname,'/compile') ;

//      exec(`${pathl} git add .`).then(data=>{
// console.log("cd1 : ", data)




//     });

   
// }


