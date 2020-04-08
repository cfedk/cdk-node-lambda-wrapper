
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

import { WrappableNodePackage } from './wrappablenodepackage';

export interface NodeLambdaWrapperProps {

    /**
     * Directory from which the dependency `packageName` can be accessed.
     * Can be given using eg [pkg-dir](https://www.npmjs.com/package/pkg-dir).
     */
    directory: string;

    /**
     * Name of dependency which is installed in `node_modules` of `directory`.
     */
    packageName: string;
}

/**
 * Wrap your npm dependency in a Lambda.
 * The package must be installed as a dependency of the requesting package and define a `main` in `package.json`.
 */
export class NodeLambdaWrapper extends cdk.Construct {

    /**
     * Reference to created Lambda function.
     */
    readonly handler: lambda.IFunction;

    constructor(scope: cdk.Construct, id: string, props: NodeLambdaWrapperProps) {
        super(scope, id);

        const dependency = new WrappableNodePackage(props.packageName, props.directory);

        this.handler = new lambda.Function(this, 'function', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: dependency.getHandlerName(),
            code: dependency.getAsset(),
        });
    }
}
