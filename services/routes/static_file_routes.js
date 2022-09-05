import express from 'express'
import file_system_tools from '../../modules/file_system.js'
const {file_system, root_dir, join} = file_system_tools()

export default async function static_file_routes(app){

    app.use(express.static(join(root_dir,"/node_modules/socket.io/client-dist")));
  
    app.use(express.static(join(root_dir,"public/client_javascript")));
    app.use(express.static(join(root_dir,"public")));
    app.use(express.static(join(root_dir,"/node_modules/socket.io/client-dist")));
    app.use(express.static(join(root_dir,"/node_modules/gridjs")));
    app.use(express.static(join(root_dir,"/node_modules/gridjs/dist")));
    app.use(express.static(join(root_dir,"node_modules/axios/dist")));
    app.use(express.static(join(root_dir,"node_modules/chartist/dist")));
    app.use(express.static(join(root_dir,"node_modules/gridstack/dist")));
    app.use(express.static(join(root_dir,"node_modules/bootstrap-icons/font")));
    app.use(express.static(join(root_dir,"node_modules/chartist-plugin-legend")));

}