import * as mockFs from 'mock-fs';

import { WrappableNodePackage } from './wrappablenodepackage';

describe('WrappableNodePackage', () => {
    test('given missing package main, throws', () => {

        mockFs({
            './node_modules/fake-dependency': {
                'package.json': '{"name": "fake-dependency"}',
            },
        });

        expect(() => {
            new WrappableNodePackage('fake-dependency', './');
        }).toThrow("node_modules/fake-dependency/package.json['main'] must be defined");


        mockFs.restore();
    });

    test('given package main which does not exist, throws', () => {

        mockFs({
            './node_modules/fake-dependency': {
                'package.json': '{"name": "fake-dependency", "main": "lib/doesnotexist"}',
            },
        });

        expect(() => {
            new WrappableNodePackage('fake-dependency', './');
        }).toThrow("Handler specified in node_modules/fake-dependency/package.json, node_modules/fake-dependency/lib/doesnotexist, does not exist");

        mockFs.restore();
    });

    describe('given package main which exists', () => {
        it('provides relative handler value', () => {

            mockFs({
                './node_modules/fake-dependency': {
                    'package.json': '{"name": "fake-dependency", "main": "lib/exists.js"}',
                    'lib': {
                        'exists.js': 'I exist',
                    },
                },
            });

            const dependency = new WrappableNodePackage('fake-dependency', './');
            expect(dependency.getDirectory()).toContain('node_modules/fake-dependency');
            expect(dependency.getMain()).toEqual('lib/exists.js');
            expect(dependency.getHandlerName()).toEqual('lib/exists.handler');

            mockFs.restore();
        });
    });
});
