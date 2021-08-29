import * as assert from 'assert';
import { after } from 'mocha';
import { getURIToFileInGraph, showGraphInJiraStatusBarItem } from '../../extension';
import { stub } from 'sinon';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import Sinon = require('sinon');
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
  after(() => {
    vscode.window.showInformationMessage('All tests done!');
  });

  let inputBoxStub: Sinon.SinonStub;

  test('Read settings from workspace settings', async () => {
    const config = vscode.workspace.getConfiguration('cures-condec-vscode');
    await config.update('jiraURL', "https://jira-se.ifi.uni-heidelberg.de", vscode.ConfigurationTarget.Workspace);
    await config.update('projectKey', "CONDEC1", vscode.ConfigurationTarget.Workspace);

    const uri = await getURIToFileInGraph("src/main/condecTestClass.java");
    assert.deepStrictEqual(uri, vscode.Uri.parse("https://jira-se.ifi.uni-heidelberg.de/projects/CONDEC1?selectedItem=decision-knowledge-page&codeFileName=condecTestClass.java"));
  }).timeout(10000);

  test('Read settings from input box', async () => {
    const config = vscode.workspace.getConfiguration('cures-condec-vscode');
    await config.update('jiraURL', undefined, vscode.ConfigurationTarget.Workspace);
    await config.update('projectKey', undefined, vscode.ConfigurationTarget.Workspace);

    inputBoxStub = stub(vscode.window, "showInputBox");
    inputBoxStub.onFirstCall().resolves("https://jira-se.ifi.uni-heidelberg.de");
    inputBoxStub.onSecondCall().resolves("CONDEC2");
    const uri = await getURIToFileInGraph("src/main/condecTestClass.java");
    inputBoxStub.restore();
    assert.deepStrictEqual(uri, vscode.Uri.parse("https://jira-se.ifi.uni-heidelberg.de/projects/CONDEC2?selectedItem=decision-knowledge-page&codeFileName=condecTestClass.java"));
  }).timeout(10000);

  test('Test exception when no Jira URL is specified or provided', async () => {
	const config = vscode.workspace.getConfiguration('cures-condec-vscode');
    await config.update('jiraURL', undefined, vscode.ConfigurationTarget.Workspace);
    await config.update('projectKey', undefined, vscode.ConfigurationTarget.Workspace);

    try {
        inputBoxStub = stub(vscode.window, "showInputBox");
        inputBoxStub.resolves();
        await getURIToFileInGraph("src/main/condecTestClass.java");
        inputBoxStub.restore();
        assert(false, "The function terminated without throwing an exception");
    } catch(e: any) {
        assert(/The Jira URL is not specified. Please provide the URL of the Jira server. You can always change the URL in the workspace settings./.test(e.message));
        inputBoxStub.restore();
    }
  }).timeout(10000);

  test('Test exception when no Project Key is specified or provided', async () => {
    const config = vscode.workspace.getConfiguration('cures-condec-vscode');
    await config.update('jiraURL', "https://jira-se.ifi.uni-heidelberg.de", vscode.ConfigurationTarget.Workspace);
    await config.update('projectKey', undefined, vscode.ConfigurationTarget.Workspace);

    try {
        inputBoxStub = stub(vscode.window, "showInputBox");
        inputBoxStub.resolves();
        await getURIToFileInGraph("src/main/condecTestClass.java");
        inputBoxStub.restore();
        assert(false, "The function terminated without throwing an exception");
    } catch(e: any) {
        assert(/The Jira Project Key is not specified. Please provide the Project Key of the Jira project. You can always change the Project Key in the workspace settings./.test(e.message));
        inputBoxStub.restore();
    }
  }).timeout(10000);

});