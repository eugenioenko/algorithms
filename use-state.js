const logs = [];
function log(...args) {
  logs.push(...args);
}

const state = [];
let globalIndex = 0;

function useState(initialState) {
  const localIndex = globalIndex;
  if (typeof state[localIndex] === "undefined")
    state[localIndex] = initialState;

  globalIndex += 1;
  return [state[localIndex], (newState) => (state[localIndex] = newState)];
}

function render(component) {
  component();
  globalIndex = 0;
}

function ComponentA() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Abc");

  log(count);
  log(name);
  setCount(count + 1);
  setName(name + name);
}

function ComponentB() {
  const [count, setCount] = useState(100);
  const [name, setName] = useState("Xyz");

  log(count);
  log(name);
  setCount(count + 1);
  setName(name + name);
}

render(ComponentA);
render(ComponentB);
render(ComponentA);
render(ComponentB);
console.log(logs);
