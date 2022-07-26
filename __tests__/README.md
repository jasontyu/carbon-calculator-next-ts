# What is this folder?
This folder stores tests for client components stored in `/pages`.

Note that all other tests are colocated with the files they test.

# If we colocate tests,  why does this `__tests__` folder exist?

Unfortunately, when creating a production build, `NextJS` attempts to include all files in the `pages` folder, including tests. This causes the webpack build to fail with the following error:

```
./node_modules/@babel/plugin-syntax-class-properties/LICENSE
Module parse failed: Unexpected token (1:4)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> MIT License
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> MIT License
| 
| Copyright (c) 2014-present Sebastian McKenzie and other contributors

Import trace for requested module:
./node_modules/@babel/ sync ^\.\/plugin\-syntax\-.*$
./node_modules/babel-preset-current-node-syntax/src/index.js
./node_modules/jest-snapshot/build/InlineSnapshots.js
./node_modules/jest-snapshot/build/State.js
./node_modules/jest-snapshot/build/index.js
./node_modules/@jest/core/build/SearchSource.js
./node_modules/@jest/core/build/index.js
./node_modules/jest/build/index.js
./pages/<name of test file>.test.tsx
```

# Is there anything we can do about it?

Moving the test into a `__tests__` folder as `jest` convention does not help. A suggestion to handle this case in NextJs core was submitted in 2017 and ultimately declined https://github.com/vercel/next.js/issues/1914

The crowd suggestion is to configure some custom webpack overrides to ignore the underlying files based on the file regex. This would definitely work, but I don't think that's a good use of time for the purpose of this take-home challenge.

Therefore, I'm letting this stay as a hack.