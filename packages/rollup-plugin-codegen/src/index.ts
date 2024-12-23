import { createCodegenHost } from 'codegen-lib';
import type { Plugin } from 'rollup';

export default function codegen(options = { outDir: 'dist', rootDir: process.cwd() }): Plugin {
  const codegen = createCodegenHost(options.rootDir);

  return {
    name: 'codegen',
    resolveId(source) {
      if (source.endsWith('.codegen')) {
        return source;
      }

      return null;
    },
    load(name) {
      if (name.endsWith('.codegen')) {
        return codegen.generate({
          name,
          options,
          addDependency: (file) => {
            this.addWatchFile(file);
          },
        });
      }

      return null;
    },
  };
}
