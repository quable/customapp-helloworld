import * as fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export async function setupAppConfig(app: any) {
  const filePath = path.join(process.cwd(), 'quable.app.yml');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const appConf = yaml.parse(fileContent);
  Object.keys(appConf).forEach((key) => {
    app.set(key, appConf[key]);
  });
}
