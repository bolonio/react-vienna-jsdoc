const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const targetFolder = path.join(__dirname, '../src/utils/languages)');
const files = fs.readdirSync(targetFolder).filter(file => file.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(targetFolder, file);
  const sourceCode = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    file,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  );

  let updatedCode = sourceCode;

  ts.forEachChild(sourceFile, node => {
    if (ts.isFunctionDeclaration(node) && node.name) {
      const functionName = node.name.text;
      const params = node.parameters.map(param => {
        const paramName = param.name.getText(sourceFile);
        const paramType = param.type ? param.type.getText(sourceFile) : 'any';
        return ` * @param {${paramType}} ${paramName}`;
      });

      const returnType = node.type ? node.type.getText(sourceFile) : 'void';
      const jsDoc = `/**
 * ${functionName}
${params.join('\n')}
 * @returns {${returnType}}
 */`;

      const functionStart = node.getStart(sourceFile);
      updatedCode =
        updatedCode.slice(0, functionStart) +
        jsDoc +
        '\n' +
        updatedCode.slice(functionStart);
    }
  });

  fs.writeFileSync(filePath, updatedCode, 'utf8');
  console.log(`Updated JSDoc for ${file}`);
});
