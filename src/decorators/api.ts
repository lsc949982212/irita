import * as types from '../types';

function Path(p: string): types.IPath{
      return function(target: any):void{
            if((target as any).prototype){
                  (target as any).prototype.path = p;
            }
      }
}

export {
      Path
}