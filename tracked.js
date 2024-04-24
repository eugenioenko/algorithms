const tracked = (value) => {
  console.log("====tracked====");
  console.log(this);
  return value;
};

class Component {
  constructor() {
    return new Proxy(this, {
      construct(target, args) {
        console.log("====construct=====");
      },
      get(target, key) {
        console.log("====get====");
        console.log(target, key);
        return target[key];
      },
      set(target, key, value) {
        console.log("====set====");
        target[key] = value;
        return true;
      },
    });
  }
}

class MyComponent extends Component {
  constructor() {
    super();
    this.value = tracked(0);
  }

  increment() {
    this.value = this.value + 1;
  }
}

const component = new MyComponent();
component.increment();
console.log(component.value);
