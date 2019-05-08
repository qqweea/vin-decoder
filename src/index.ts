import { VinParser, allTokens } from './lexer';

class VinDecoder extends VinParser {
  WMI: string;
  VDS: string;
  VIS: string;
  
  constructor(vin: string) {
    super();
    this.WMI = vin.slice(0, 3);
    this.VDS = vin.slice(4, 9);
    this.VIS = vin.slice(10, 17);
  }


}

const vinDecoded = new VinDecoder('JMZKFGWMA00702223');

console.log(vinDecoded)
