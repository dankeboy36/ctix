import * as tsm from 'ts-morph';

/**
 * @param param.tsconfig
 * @param param.ignore
 * @returns
 */
export default function getTypeScriptProject(projectPath: string): tsm.Project {
  // Exclude exclude file in .ctiignore file: more exclude progress
  const project = new tsm.Project({ tsConfigFilePath: projectPath });
  return project;
}
