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
    getAccount(){
        let token = sessionStorage.getItem('token');
        if(token){
            return JSON.parse(token);
        }else{
            return null;
        }
    },
    getUserNameByAddress(address){
        return this.getAccountList().find(item=>item.address === address) ? this.getAccountList().find(item=>item.address === address).name : address
    },
    getPublicKeyByAddress(address){
        return this.getAccountList().find(item=>item.address === address) ? this.getAccountList().find(item=>item.address === address).publicKey : ''
    },
    isSupervise(){
        let isSupervise = false;
        let token = sessionStorage.getItem('token');
        if(token){
            isSupervise = JSON.parse(token).isSupervise;
            if(isSupervise === 'true'){
                return true;
            }else{
                return false;
            }
        }else{
            return isSupervise;
        }
    }

};