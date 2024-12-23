import { createCodegenHost } from 'codegen-lib';
import type { Plugin } from 'vite';

export interface CodegenPluginOptions {
  outDir?: string;
  rootDir?: string;
}

const defaultOptions: CodegenPluginOptions = { outDir: 'dist', rootDir: process.cwd() };

export default function codegen(options = defaultOptions): Plugin {
  const { rootDir = defaultOptions.rootDir, outDir = defaultOptions.outDir } = options;
  const codegen = createCodegenHost(rootDir);

  return {
    name: 'codegen',
    resolveId(source) {
      if (source.endsWith('.codegen')) {
        return source;
      }

      return null;
    },
    async load(name) {
      if (name.endsWith('.codegen')) {
        const result = await codegen.generate({
          name,
          options: {
            outDir,
            rootDir,
          },
          addDependency: (file) => {
            this.addWatchFile(file);
          },
        });
        return result.value;
      }

      return null;
    },
  };
}
