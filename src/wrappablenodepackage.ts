
import * as fs from 'fs';
import * as path from 'path';

import * as lambda from '@aws-cdk/aws-lambda';

import { NodePackage } from './nodepackage';

export class WrappableNodePackage extends NodePackage {

    constructor(packageName: string, fromDir: string) {
        super(packageName, fromDir);

        this.validate();
    }

    protected validate() {

        super.validate();

        if (!this.getMain()) {
            throw new Error(`${this.getDirectory()}/package.json['main'] must be defined`);
        }

        const resolvedMain = path.join(this.getDirectory(), this.getMain());
        if (!fs.existsSync(resolvedMain)) {
            throw Error(`Handler specified in ${this.getPackageFile()}, ${resolvedMain}, does not exist`);
        }
    }

    getMain(): string {
        return this.getJson().main;
    }

    getAsset(): lambda.AssetCode {
        return lambda.Code.fromAsset(this.getDirectory());
    }

    getHandlerName(): string {
        const handlerFile = this.getMain();
        const noExtension = handlerFile.split('.').slice(0, -1).join('.');
        const codeRef = `${noExtension}.handler`;
        return codeRef;
    }

}
