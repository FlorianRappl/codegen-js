import type * as ParcelBundler from 'parcel-bundler';

export = function (bundler: ParcelBundler) {
  const name = './CodeGenAsset';
  bundler.addAssetType('codegen', require.resolve(name));
};
