import * as vscode from 'vscode';
import * as path from 'path';

export let showGraphInJiraStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	// register a command that is invoked when the status bar
	// item is selected
	const showGraphInJiraCommandId = 'showGraphInJira';
	subscriptions.push(vscode.commands.registerCommand(showGraphInJiraCommandId, async () => {
		try {
			if (vscode.window.activeTextEditor == undefined) {
				throw new Error('No active text editor detected.');
			}
			if (vscode.workspace.workspaceFolders == undefined) {
				throw new Error('No workspace detected.');
			}
			vscode.env.openExternal(await getURIToFileInGraph(vscode.window.activeTextEditor.document.fileName));
		} catch(e: any) {
				vscode.window.showErrorMessage(e);
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
	subscriptions.push(vscode.workspace.onDidChangeConfiguration(updateStatusBarItem));

	// update status bar item once at start
	updateStatusBarItem();
}

export async function getURIToFileInGraph(filePath: string): Promise<vscode.Uri> {
	const fileName = path.basename(filePath);

	const config = vscode.workspace.getConfiguration('cures-condec-vscode');
	let jiraURL = config.get('jiraURL');
	let projectKey = config.get('projectKey');

	if (jiraURL == undefined) {
		const jiraURLOptions: vscode.InputBoxOptions = {
			prompt: "URL of the Jira server"
		};
		
		await vscode.window.showInputBox(jiraURLOptions).then(value => {
			if (value) {
				config.update('jiraURL', value, vscode.ConfigurationTarget.Workspace);
				vscode.window.showInformationMessage("You can always change the URL in the workspace settings.");
				jiraURL = value;
			}
		});
	}
	if (jiraURL == undefined) {
		throw new Error('The Jira URL is not specified. Please provide the URL of the Jira server. You can always change the URL in the workspace settings.');
	}


	if (projectKey == undefined) {
		const projectKeyOptions: vscode.InputBoxOptions = {
			prompt: "Project Key of the Jira project"
		};
		
		await vscode.window.showInputBox(projectKeyOptions).then(value => {
			if (value) {
				config.update('projectKey', value, vscode.ConfigurationTarget.Workspace);
				vscode.window.showInformationMessage("You can always change the Project Key in the workspace settings.");
				projectKey = value;
			}
		});
	}
	if (projectKey == undefined) {
		throw new Error('The Jira Project Key is not specified. Please provide the Project Key of the Jira project. You can always change the Project Key in the workspace settings.');
	}

	return vscode.Uri.parse(jiraURL + "/projects/" + projectKey + "?selectedItem=decision-knowledge-page&codeFileName=" + fileName);
}

function updateStatusBarItem(): void {
	if (vscode.window.activeTextEditor == undefined) {
		showGraphInJiraStatusBarItem.hide();
	} else {
		const config = vscode.workspace.getConfiguration('cures-condec-vscode');
		const jiraURL = config.get('jiraURL');
		const projectKey = config.get('projectKey');

		if (jiraURL == undefined || projectKey == undefined) {
			showGraphInJiraStatusBarItem.text = 'Enter Jira project information…';
			showGraphInJiraStatusBarItem.show();
		} else {
			showGraphInJiraStatusBarItem.text = 'Open Graph in Jira';
			showGraphInJiraStatusBarItem.show();
		}
	}
}