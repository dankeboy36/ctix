export default interface IOnlySingleCliOption {
  mode: 'single';

  /**
   * Output directory. It works only single mode.
   * @mode single
   * @default true
   */
  o?: string;
  output?: string;

  /**
   * Only work single file generation mode. use rootDir configuration in tsconfig.json.
   * Export file create under a rootDir directory. If you set rootDirs, ctix use first element of array.
   * @mode single
   * @default false
   */
  r?: boolean;
  useRootDir?: boolean;
}
