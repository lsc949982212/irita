#!/usr/bin/env node

let fs = require('fs');
let program = require('commander');
let version = fs.readFileSync("src/version").toString();

function list (val) {
    return val.split(',')
}

program
    .version(version)
    .option("-p, --params <items>", "app params", list)
    .parse(process.argv);

console.log('Replacing environments ...');
let env,explorerAddress,fistPsd,firstPublicKey,firstAddress,
    firstName,firstDomain,secondPsd,secondPublicKey,secondAddress,
    secondName,secondDomain,chainId,checkerAddress,firstIsSupervise,secondIsSupervise;
console.log(env);
if (program.params) {
    env = program.params[0];
    explorerAddress = program.params[1];
    fistPsd = program.params[2];
    firstPublicKey = program.params[3];
    firstAddress = program.params[4];
    firstName = program.params[5];
    firstDomain = program.params[6];
    secondPsd = program.params[7];
    secondPublicKey = program.params[8];
    secondAddress = program.params[9];
    secondName = program.params[10];
    secondDomain = program.params[11];
    chainId = program.params[12];
    checkerAddress = program.params[13];
    firstIsSupervise = program.params[14];
    secondIsSupervise = program.params[15];

}


replaceEnv([
        "src/config/config.json"
    ],
    {
        "version": version,
        "env": env,
        "explorerAddress":explorerAddress,
        "fistPsd":fistPsd,
        "firstPublicKey":firstPublicKey,
        "firstAddress":firstAddress,
        "firstName":firstName,
        "firstDomain":firstDomain,
        "secondPsd":secondPsd,
        "secondPublicKey":secondPublicKey,
        "secondAddress":secondAddress,
        "secondName":secondName,
        "secondDomain":secondDomain,
        "chainId":chainId,
        "checkerAddress":checkerAddress,
        "firstIsSupervise":firstIsSupervise,
        "secondIsSupervise":secondIsSupervise
    }
);


function replaceEnv(files, params) {
    files.forEach(function(file,index){
        let result = fs.readFileSync(file).toString();
        for (let key in params) {
            let r = "\\${"+key+"}";
            result = result.replace(new RegExp(r,"g"), params[key]);
        }

        fs.writeFileSync(file, result)
    });
}