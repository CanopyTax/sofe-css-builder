# sofe-css-builder
Build CSS services for sofe. Specifically supports CSS Modules.

## Installation
`npm install sofe-css-builder`

## Usage
### CLI
`sofe-css-builder --help`

### API
```javascript
import builder from 'sofe-css-builder';

builder(cssFromInputFile, inputFilePath, serviceName, options = {})
  .then(({css, exports}) // modified css and an exports object
  .catch(err)
```
