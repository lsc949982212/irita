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
    secondName,secondDomain,chainId,checkerAddress,thirdPsd,thirdPublicKey,thirdAddress,
    thirdName,thirdDomain,firstIsSupervise,secondIsSupervise,thirdIsSupervise;
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
    thirdPsd = program.params[14];
    thirdPublicKey = program.params[15];
    thirdAddress = program.params[16];
    thirdName = program.params[17];
    thirdDomain = program.params[18];
    firstIsSupervise = program.params[19];
    secondIsSupervise = program.params[20];
    thirdIsSupervise = program.params[21];

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
        "thirdPsd":thirdPsd,
        "thirdPublicKey":thirdPublicKey,
        "thirdAddress":thirdAddress,
        "thirdName":thirdName,
        "thirdDomain":thirdDomain,
        "firstIsSupervise":firstIsSupervise,
        "secondIsSupervise":secondIsSupervise,
        "thirdIsSupervise":thirdIsSupervise,
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