module.exports = {
  name: 'michelson-editor',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/michelson-editor',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
