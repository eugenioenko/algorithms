interface Config {
  one: number;
  two: number;
}

class Server {
  config: Config;
  constructor(...options: ((option: Config) => Config)[]) {
    const defaults: Config = {
      one: 1,
      two: 2,
    };
    for (const option of options) {
      option(defaults);
    }
    this.config = defaults;
  }
}

function withThree() {
  return function (option: Config): Config {
    option.one = 3;
    return option;
  };
}

const s = new Server(withThree());
