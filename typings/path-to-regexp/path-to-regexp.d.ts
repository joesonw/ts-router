// Type definitions for path-to-regexp v1.0.3
// Project: https://github.com/pillarjs/path-to-regexp
// Definitions by: xica <https://github.com/xica>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "path-to-regexp" {

    function pathToRegexp(path: string, keys?: pathToRegexp.Key[], options?: pathToRegexp.Options): RegExp;

    module pathToRegexp {
        interface Options {
            sensitive?: boolean;
            strict?: boolean;
            end?: boolean;
        }

        interface Key {
            name: string;
            prefix: string;
            delimiter: string;
            optional: boolean;
            repeat: boolean;
            pattern: string;
        }

    }

    export = pathToRegexp;

}
