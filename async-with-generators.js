function asynq(promise) {
  const generator = promise();

  (function next(value) {
    const it = generator.next(value);

    if (it.done) {
      return it.value;
    } else {
      return Promise.resolve(it.value).then(next);
    }
  })();
}

asynq(function* getData(a) {
  const data1 = yield 1;
  console.log(data1);

  const data2 = yield new Promise((resolve) => {
    resolve(2);
  });
  console.log(data2);
  const response = yield fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data3 = yield response.json();
  console.log(data3);
});
