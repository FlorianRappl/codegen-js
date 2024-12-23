import { createRequire } from 'module';

function reloadGenerator(requireModule: any, name: string) {
  const path = requireModule.resolve(name);
  delete requireModule.cache[path];
  return requireModule(name);
}

function noop() {}

export interface CodegenDetailsOptions {
  outDir?: string;
  rootDir?: string;
}

export interface CodegenDetails {
  name: string;
  options: CodegenDetailsOptions;
  addDependency?(file: string, options: CodegenDetailsOptions): void;
}

export interface CodegenHost {
  load(name: string): any;
  generate(details: CodegenDetails): Promise<string>;
}

export function createCodegenHost(fileOrDirName: string): CodegenHost {
  const requireModule = createRequire(fileOrDirName);
  const host: CodegenHost = {
    load(name) {
      return reloadGenerator(requireModule, name);
    },
    async generate(details) {
      const { name, options = {}, addDependency = noop } = details;

      if (typeof name !== 'string') {
        throw new Error('You need to pass in a string for "name".');
      }

      const generator = host.load(details.name);
      return await generator.call({
        name,
        options,
        addDependency,
      });
    },
  };
  return host;
}
