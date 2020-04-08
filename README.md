# What is this thing?

A wrapper for node-based cdk-defined AWS Lambda handlers.

Instead of worrying about assets, import (1) your npm package handler code (2) this library package.

# Usage

In your cdk application:

```
npm install --save your-lambda-handler @cfedk/cdk-node-lambda-wrapper pkg-dir
```

In your cdk code:
```
import * as pkgDir from 'pkg-dir';
import { NodeLambdaWrapper } from '@cfedk/cdk-node-lambda-wrapper';

const currentPackageDir = pkgDir.sync();
const myLambdaHandler = new NodeLambdaWrapper(this, 'Handler', {
    directory: currentPackageDir,
    packageName: 'your-lambda-handler'
}).handler;
```

# Requirements

Your lambda handler package (`your-lambda-handler` above) must define a `main` in `package.json`, eg `lib/index.js`. This will be used as the entry point of the lambda.

The main file must export a function `handler` which will be run on invocation. Eg:

```
[...]
const server = serverlessExpress.createServer(app);

export const handler = (event: lambda.APIGatewayProxyEvent, context: lambda.Context) => {
    serverlessExpress.proxy(server, event, context);
}

```
