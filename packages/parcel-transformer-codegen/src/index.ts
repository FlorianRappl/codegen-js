import { Transformer } from '@parcel/plugin';
import { createCodegenHost } from 'codegen-lib';

const codegen = createCodegenHost(process.cwd());

async function compile(name: string, outDir: string, rootDir: string) {
  const watchFiles: Array<string> = [];
  const contents = await codegen.generate({
    name,
    options: {
      outDir,
      rootDir,
    },
    addDependency: (file) => {
      watchFiles.push(file);
    },
  });
  return {
    watchFiles,
    contents,
  };
}

export default new Transformer({
  async transform({ asset, options }) {
    const outDir = options.projectRoot + '/dist';
    const result = await compile(asset.filePath, outDir, options.projectRoot);

    for (const file of result.watchFiles) {
      asset.addDependency({
        specifier: file,
        specifierType: 'esm',
      });
    }

    asset.type = result.contents.type;
    asset.setCode(result.contents.value);
    return [asset];
  },
});
