import docs from './doc.json' with {type: 'json'};
import * as fs from 'fs';

const generateIndex = (docs, folder) => {
  const content = `
## ${folder}
  ${docs
    .map(doc => {
      return `
<a href="#${doc.name}">${doc.name}(${
        doc.params && doc.params.length > 0
          ? doc.params.map(param => param.name).join(',')
          : ''
      }) ${doc.returns ? '⇒' : ''} ${doc.returns && doc.returns[0].type?.names ? doc.returns[0].type?.names.map(name => `<code>${cleanType(name)}</code>`).join(' | ') : ''}</a>`;
    })
    .join('\n')}`;
  return content;
};

const getDocsFolderItems = folder => {
  return docs.filter(doc => {
    return doc.meta.path.includes(`src/${folder}`);
  });
};

const cleanType = type => {
  if (type.startsWith('Array.')) {
    return `${type.replace('Array.<', '').replace('>', '')}[]`;
  }
  return type;
};

const cleanPath = path => {
  const srcIndex = path.indexOf('/src');
  const cleanedPath = path.substring(srcIndex);
  return cleanedPath;
};

const generateTable = (params, title, hasName = true) => {
  return params && params.length > 0
    ? `
### ${title}
| ${hasName ? 'Name |' : ''} Type | Description |
| ${hasName ? '--- |' : ''} --- | --- |
${params
  .map(param => {
    return `| ${hasName ? `${param.name} |` || '' : ''} ${param.type?.names ? param.type?.names.map(name => `<code>${cleanType(name)}</code>`).join(' &#124; ') : ''} | ${param.description || ''} |`;
  })
  .join('\n')}
  `
    : '';
};

const generateDeprecated = doc => {
  return doc.deprecated
    ? `
> [!CAUTION]
> **DEPRECATED**: ${doc.deprecated}`
    : '';
};

const generateName = doc => {
  return `
<a name="${doc.name}"></a>

## ${doc.name}(${
    doc.params && doc.params.length > 0
      ? doc.params.map(param => param.name).join(',')
      : ''
  }) ${doc.returns ? '⇒' : ''} ${doc.returns && doc.returns[0].type?.names ? doc.returns[0].type?.names.map(name => `<code>${cleanType(name)}</code>`).join(' | ') : ''}`;
};

const generateLink = doc =>
  `[See ${doc.name} code](${cleanPath(doc.meta.path)}/${doc.meta.filename}#L${doc.meta.lineno})`;

const generateDocsFolder = (docs, folder) => {
  const content = `
# ${folder}
${docs
  .map(doc => {
    return `
${generateName(doc)}
${doc.description}
${generateDeprecated(doc)}
${generateTable(doc.params, 'Parameters')}
${generateTable(doc.returns, 'Returns', false)}
${generateLink(doc)}`;
  })
  .join('')}
____`;
  return content;
};

const generateDocs = () => {
  const actions = getDocsFolderItems('actions');
  const actionsIndex = generateIndex(actions, 'Actions');
  const actionsContent = generateDocsFolder(actions, 'Actions');

  const constants = getDocsFolderItems('constants');
  const constantsIndex = generateIndex(constants, 'Constants');
  const constantsContent = generateDocsFolder(constants, 'Constants');

  const contexts = getDocsFolderItems('contexts');
  const contextsIndex = generateIndex(contexts, 'Contexts');
  const contextsContent = generateDocsFolder(contexts, 'Contexts');

  const hooks = getDocsFolderItems('hooks');
  const hooksIndex = generateIndex(hooks, 'Hooks');
  const hooksContent = generateDocsFolder(hooks, 'Hooks');

  const middlewares = getDocsFolderItems('middlewares');
  const middlewaresIndex = generateIndex(middlewares, 'Middlewares');
  const middlewaresContent = generateDocsFolder(middlewares, 'Middlewares');

  const reducers = getDocsFolderItems('reducers');
  const reducersIndex = generateIndex(reducers, 'Reducers');
  const reducersContent = generateDocsFolder(reducers, 'Reducers');

  const utils = getDocsFolderItems('utils');
  const utilsIndex = generateIndex(utils, 'Utils');
  const utilsContent = generateDocsFolder(utils, 'Utils');

  const content = `
# Index
${actions.length > 0 ? actionsIndex : ''}
${constants.length > 0 ? constantsIndex : ''}
${contexts.length > 0 ? contextsIndex : ''}
${hooks.length > 0 ? hooksIndex : ''}
${middlewares.length > 0 ? middlewaresIndex : ''}
${reducers.length > 0 ? reducersIndex : ''}
${utils.length > 0 ? utilsIndex : ''}
____
${actions.length > 0 ? actionsContent : ''}
${constants.length > 0 ? constantsContent : ''}
${contexts.length > 0 ? contextsContent : ''}
${hooks.length > 0 ? hooksContent : ''}
${middlewares.length > 0 ? middlewaresContent : ''}
${reducers.length > 0 ? reducersContent : ''}
${utils.length > 0 ? utilsContent : ''}
`;

  // write to file
  fs.writeFileSync('./docs/README.md', content, err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File written successfully');
  });

  return 'Documentation generated successfully';
};

export default generateDocs;
