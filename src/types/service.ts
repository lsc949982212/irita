export enum Service {
      check = 1
}

export interface InteractPath {
      xPath: string;
      interactType: number;
}

export interface InteractItem {
      timestamp: number;
      service: Service;
      interact: InteractPath[];
      serviceName?:string,
}