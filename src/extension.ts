import * as vscode from 'vscode';
import * as path from 'path';
import { config } from 'process';

let showGraphInJiraStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	// register a command that is invoked when the status bar
	// item is selected
	const showGraphInJiraCommandId = 'showGraphInJira';
	subscriptions.push(vscode.commands.registerCommand(showGraphInJiraCommandId, async () => {
		if (vscode.window.activeTextEditor != undefined && vscode.workspace.workspaceFolders != undefined) {
			var filePath = vscode.window.activeTextEditor.document.fileName;
			var fileName = path.basename(filePath);

			var config = vscode.workspace.getConfiguration('cures-condec-vscode');
			var jiraURL = config.get('jiraURL');
			var projectKey = config.get('projectKey');

			if (jiraURL == undefined) {
				let jiraURLOptions: vscode.InputBoxOptions = {
					prompt: "URL of the Jira server"
				}
				
				const jiraURLInputBox = await vscode.window.showInputBox(jiraURLOptions).then(value => {
					if (!value) {
						vscode.window.showErrorMessage("The Jira URL is not specified. Please provide the URL of the Jira server. You can always change the URL in the workspace settings.");
					} else {
						config.update('jiraURL', value);
						vscode.window.showInformationMessage("You can always change the URL in the workspace settings.");
						jiraURL = value;
					}
				});
			}

			if (projectKey == undefined) {
				let projectKeyOptions: vscode.InputBoxOptions = {
					prompt: "Project Key of the Jira project"
				}
				
				const projectKeyInputBox = await vscode.window.showInputBox(projectKeyOptions).then(value => {
					if (!value) {
						vscode.window.showErrorMessage("The Jira Project Key is not specified. Please provide the Project Key of the Jira project. You can always change the Project Key in the workspace settings.");
					} else {
						config.update('projectKey', value);
						vscode.window.showInformationMessage("You can always change the Project Key in the workspace settings.");
						projectKey = value;
					}
				});
			}

			if (jiraURL != undefined && projectKey != undefined) {
				showGraphInJiraStatusBarItem.text = 'Open Graph in Jira';
				showGraphInJiraStatusBarItem.show();
				vscode.env.openExternal(vscode.Uri.parse(jiraURL + "/projects/" + projectKey + "?selectedItem=decision-knowledge-page&codeFileName=" + fileName));
			}
		}
	}));

	// create a new status bar item that we can now manage
	showGraphInJiraStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	showGraphInJiraStatusBarItem.command = showGraphInJiraCommandId;
	subscriptions.push(showGraphInJiraStatusBarItem);

	// register some listener that make sure the status bar 
	// item always up-to-date
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	subscriptions.push(vscode.window.onDidChangeWindowState(updateStatusBarItem));

	// update status bar item once at start
	updateStatusBarItem();
}

function updateStatusBarItem(): void {
	if (vscode.window.activeTextEditor == undefined) {
		showGraphInJiraStatusBarItem.hide();
	} else {
		const config = vscode.workspace.getConfiguration('cures-condec-vscode');
		var jiraURL = config.get('jiraURL');
		var projectKey = config.get('projectKey');

		if (jiraURL == undefined || projectKey == undefined) {
			showGraphInJiraStatusBarItem.text = 'Enter Jira project information…';
			showGraphInJiraStatusBarItem.show();
		} else {
			showGraphInJiraStatusBarItem.text = 'Open Graph in Jira';
			showGraphInJiraStatusBarItem.show();
		}
	}
}
