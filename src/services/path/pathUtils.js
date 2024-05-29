import {fileURLToPath} from 'url';
import { dirname } from 'path';
import path from "path";

//Directorios actuales
export let __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);


let srcDir = path.join(__dirname, "../../");

__dirname = srcDir;


//console.log("Dirname: ", __dirname);
//console.log("Filename: ", __filename);

export default __dirname;