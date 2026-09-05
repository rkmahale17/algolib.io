let tcCode = "assert(promisesAll([Promise.resolve(1), Promise.resolve('hello'), Promise.resolve(true)]) === [1, 'hello', true]);\nassertThrows(() => promisesAll([p1, p2]));";
tcCode = tcCode.replace(/assert\s*\(\s*promisesAll/g, 'assert(await promiseAll');
tcCode = tcCode.replace(/promisesAll/g, 'promiseAll');
tcCode = tcCode.replace(/assert\s*\((.+?)\s*===\s*(.+?)\)\s*(;|$)/g, 'assertEquals($1, $2);');
console.log(tcCode);
