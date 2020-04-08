import * as fs from 'fs';
import * as path from 'path';

/**
 * TODO: Verify all dependencies are installed with https://www.npmjs.com/package/npm-programmatic
 */
export class NodePackage {

    private readonly packageName: string;
    private readonly fromDir: string;

    constructor(packageName: string, fromDir: string) {
        this.packageName = packageName;
        this.fromDir = fromDir;

        this.validate();
    }

    protected validate() {
        if(!fs.existsSync(this.getDirectory())) {
            throw new Error(`Package ${this.packageName} is not installed in ${this.fromDir}: ${this.getDirectory()} does not exist`);
        }

        if(!fs.existsSync(this.getPackageFile())) {
            throw new Error(`Expected ${this.getPackageFile()} does not exist`);
        }
    }

    getPackageFile(): string {
        return path.join(this.getDirectory(), 'package.json');
    }

    getJson(): any {
        return JSON.parse(fs.readFileSync(this.getPackageFile(), 'utf-8'));
    }

    getDirectory(): string {
        return path.join(this.fromDir, 'node_modules', this.packageName);
    }
}
