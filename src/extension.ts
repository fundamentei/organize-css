import * as vscode from "vscode";
import parseAndSort from "./parseAndSort";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("extension.organizeCSS", async () => {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    const editor = vscode.window.activeTextEditor;
    const selectionText = editor.document.getText(editor.selection);

    if (!selectionText) {
      return;
    }

    parseAndSort(selectionText).then(withSortedCSSProperties => {
      if (withSortedCSSProperties) {
        editor.edit(editBuilder => {
          return editBuilder.replace(editor.selection, withSortedCSSProperties);
        });
      }
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
