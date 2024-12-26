import { Asset } from 'parcel-bundler';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import { createCodegenHost } from 'codegen-lib';

declare module 'parcel-bundler/index' {
  class Asset {
    constructor(name: string, options: any);
    addDependency(file: string, options?: { includedInParent?: boolean }): void;
  }
}

const codegen = createCodegenHost(process.cwd());

class CodeGenAsset extends Asset {
  constructor(private name: string, private options: any) {
    super(name, options);
  }

  getFiles(dir: string, filter?: (file: string) => boolean) {
    const files = readdirSync(dir)
      .map((m) => resolve(dir, m))
      .filter((m) => typeof filter !== 'function' || filter(m));

    files.forEach((file) => this.addDependency(file, { includedInParent: true }));

    return files;
  }

  load() {}

  async generate() {
    const value = await codegen.generate({
      // Parcel v1 only supports CJS - otherwise throws an exception:
      // "A dynamic import callback was not specified.", see:
      // https://github.com/parcel-bundler/parcel/issues/8987
      // (Parcel v2, but the issue exists since v1 and has only been fixed in v2)
      type: 'cjs',
      name: this.name,
      options: this.options,
    });

    return [value];
  }
}

module.exports = CodeGenAsset;
