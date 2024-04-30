class Singleton {
  constructor() {
    if (Singleton._instance) {
      return Singleton._instance;
    }
    Singleton._instance = this;

    // todo - rest of constructor goes here
  }
}

var instanceOne = new Singleton();
var instanceTwo = new MyClass();

console.log(instanceOne === instanceTwo);
