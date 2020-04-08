import * as mockFs from 'mock-fs';

import { NodePackage } from './nodepackage';

describe('NodePackage', () => {
    test('given a package which does not exist, throws', () => {

        expect(() => {
            new NodePackage('fake-dependency', './');
        }).toThrow('Package fake-dependency is not installed in ./: node_modules/fake-dependency does not exist');

    });

    test('given a package with missing package.json, throws', () => {

        mockFs({
            './node_modules/fake-dependency': {}
        });

        expect(() => {
            new NodePackage('fake-dependency', './');
        }).toThrow('Expected node_modules/fake-dependency/package.json does not exist');

    });

    test('given a correctly structured package, retrieves values', () => {
        mockFs({
            './node_modules/fake-dependency': {
                'package.json': '{"name": "fake-dependency"}',
            },
        });

        const dependency = new NodePackage('fake-dependency', './');
        expect(dependency.getDirectory()).toEqual('node_modules/fake-dependency');
        expect(dependency.getPackageFile()).toEqual('node_modules/fake-dependency/package.json');
        expect(dependency.getJson()).toEqual({
            name: 'fake-dependency',
        });
    });
});
