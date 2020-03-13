#!/bin/bash

function recover_config_file(){
  git checkout -- src/config/config.json
}

function use_dev(){
  yarn param dev,http://dev.iritaplorer.io,qqqqqqqqq1,fap1addwnpepqwdkta28s4jccw2td520nl8a04td0kwpyy73006s2j2znaexyz2l79dq9lu,faa1f7jnpkt2yxd8h72w6hf03juy3uk6m2sur845kq,供应商A,http://edge1.dev.bianjie.ai,qqqqqqqqq2,fap1addwnpepqth8487w2wewvnfudrlgcm838a4zu4jwxnumavt0pk4yz78deajekecdzgq,faa1tzlqyrykyvqnqv2hj7g9y2777recf0nawfyv45,保理服务商B,http://edge2.dev.bianjie.ai,irita-dev,faa1fwgw9ej3yzq6frn8rq7pswfhkdcsq8szgx0xkq,qqqqqqqqq3,fap1addwnpepq07zet2nx23m2mm9alhfazncynx388n3srmj4xlt2z7frxjyy98w29fj90t,faa16q0u7ddzc46fp3swwt7xt2u34vy0u2d08xwlmq,????,http://edge4.dev.bianjie.ai,false,false,true
}

function use_qa(){
  yarn param dev,http://dev.iritaplorer.io,qqqqqqqqq1,039b65f54785658c394b6d14f9fcfd7d56d7d9c1213d17bf50549429f7262095ff,faa1f7jnpkt2yxd8h72w6hf03juy3uk6m2sur845kq,供应商A,http://10.1.4.50:8080,qqqqqqqqq2,02ee7a9fce53b2e64d3c68fe8c6cf13f6a2e564e34f9beb16f0daa4178edcf659b,faa1tzlqyrykyvqnqv2hj7g9y2777recf0nawfyv45,保理服务商B,http://10.1.4.50:8081
}

function use_stage(){
  yarn param dev,http://dev.iritaplorer.io,qqqqqqqqq1,039b65f54785658c394b6d14f9fcfd7d56d7d9c1213d17bf50549429f7262095ff,faa1f7jnpkt2yxd8h72w6hf03juy3uk6m2sur845kq,供应商A,http://10.1.4.50:8080,qqqqqqqqq2,02ee7a9fce53b2e64d3c68fe8c6cf13f6a2e564e34f9beb16f0daa4178edcf659b,faa1tzlqyrykyvqnqv2hj7g9y2777recf0nawfyv45,保理服务商B,http://10.1.4.50:8081

}


if [ $1 == "r" ] ; then
  recover_config_file
elif [ $1 == "d" ] ; then
  use_dev
elif [ $1 == "q" ] ; then
  use_qa
elif [ $1 == "s" ] ; then
  use_stage
fi