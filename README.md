# cures-condec-vscode

[![Build Status](https://travis-ci.org/cures-hub/cures-condec-vscode.svg?branch=master)](https://travis-ci.org/cures-hub/cures-condec-vscode)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/eddb9e9514e643cca1ed9b36c17d9926)](https://www.codacy.com/gh/cures-hub/cures-condec-vscode/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cures-hub/cures-condec-vscode&amp;utm_campaign=Badge_Grade)
[![Codecoverage](https://codecov.io/gh/cures-hub/cures-condec-vscode/branch/master/graph/badge.svg)](https://codecov.io/gh/cures-hub/cures-condec-vscode/branch/master)

[![GitHub contributors](https://img.shields.io/github/contributors/cures-hub/cures-condec-vscode.svg)](https://github.com/cures-hub/cures-condec-vscode/graphs/contributors)

The CURES ConDec Visual Studio Code extension enables the user to explore decision knowledge from Visual Studio Code. Decision knowledge covers knowledge about decisions, the problems they address, solution proposals, their context, and justifications (rationale). The user can capture decision knowledge in code and commit messages and explore relevant knowledge for code. 

## Installation
### Prerequisites
The following prerequisites are necessary to compile the extension from source code:

- [Visual Studio Code](https://code.visualstudio.com/Download)
- [Node.js](https://nodejs.org/en/download/)
- [Visual Studio Code Extension Manager](https://github.com/microsoft/vscode-vsce), which is best installed using `npm`: `npm install -g vsce`

### Compilation and Packaging
The source code can be compiled within Visual Studio Code. The `.vscode` folder contains tasks and launch commands that assist in compiling the extension.

To export the extension, navigate into the `cures-condec-vscode` folder and run:
```
npm install
vsce package -o cures-condec-vscode.vsix
```

### Download of Precompiled .vsix file
The precompiled .vsix file for the latest release can be found here: https://github.com/cures-hub/cures-condec-vscode/releases/latest

### Installation in Visual Studio Code
- Download or export the cures-condec-vscode.vsix file.
- [Install Visual Studio Code](https://code.visualstudio.com/Download)
- Run `code --install-extension cures-condec-vscode.vsix`

## User Interface and Usage Example
The extension provides a status bar button that will open the currently active code file in the [Decision Knowledge Page in Jira](https://github.com/cures-hub/cures-condec-jira#decision-knowledge-page), where decision knowledge or other knowledge elements linked to or documented in the code file are shown in different views. The Jira Server URL and the Project Key related to a workspace is stored and can be changed in the workspace settings. 
![CURES ConDec Visual Studio Code extension](https://github.com/cures-hub/cures-condec-vscode/raw/master/doc/statusbar.png) 
