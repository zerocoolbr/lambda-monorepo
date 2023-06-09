import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
// import {NodejsFunction, SourceMapMode} from "aws-cdk-lib/aws-lambda-nodejs"
import path from 'path';
import { Function, FunctionUrlAuthType, Runtime, Code } from 'aws-cdk-lib/aws-lambda';

import { lambdas } from '../../packages/@lambdas';

export class LambdaMonorepoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    for(const {name} of lambdas) {
        /* Need Docker to transpile packages
        const lambda = new NodejsFunction(this, name, {
            runtime: Runtime.NODEJS_18_X,
            entry: path.join(__dirname, '..', '..', 'packages', '@lambdas', name, 'src', 'index.ts'),
            handler: "handler",
            bundling: {
                sourceMap: true,
                minify: false,
                sourceMapMode: SourceMapMode.INLINE,
            }
        });
        */

        const lambda = new Function(this, name, {
            handler: 'index.handler',
            runtime: Runtime.NODEJS_18_X,
            code: Code.fromAsset(path.join(__dirname, '..', '..', 'packages', '@lambdas', name, 'dist'))
        });

        const lambdaUrl = lambda.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            cors: {
                allowedOrigins: ['*'],
            }
        });

        new cdk.CfnOutput(this, `${name}-url`, {
            value: lambdaUrl.url,
           });
    }
  }
}
