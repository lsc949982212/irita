import cfg from '../config/config';

export const accountHelper = {
    getAccountList(){
        let accountList = [];
        for(let key in cfg.account){
            accountList.push(cfg.account[key]);
        }
        return accountList;
    },
    isOwner(address){
        let token = sessionStorage.getItem('token');
        if(token){
            let currentAddr = JSON.parse(token).address;
            if(currentAddr === address){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    },
    getAccountAddress(){
        let token = sessionStorage.getItem('token');
        if(token){
            return JSON.parse(token).address;
        }else{
            return '';
        }
    }
};