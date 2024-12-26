import validateOptions from 'schema-utils';
import { getOptions } from 'loader-utils';
import { createCodegenHost } from 'codegen-lib';
import type { Compiler } from 'webpack';

const schema = {
  type: 'object' as const,
  properties: {},
  additionalProperties: false,
};

const rootDir = process.cwd();
const codegen = createCodegenHost(rootDir);

export default async function loader(source: string, map: string, meta: any) {
  const options = getOptions(this);

  validateOptions(schema, options, {
    name: 'Codegen Loader',
    baseDataPath: 'options',
  });

  const name = this.resourcePath;
  const compiler = this._compiler as Compiler;
  const callback = this.async();

  try {
    const content = await codegen.generate({
      name,
      options: {
        outDir: compiler?.options?.output?.path,
        rootDir,
      },
      addDependency: (file) => this.addDependency(file),
    });

    callback(null, content.value, map, meta);
  } catch (err) {
    callback(err, source);
  }
}
