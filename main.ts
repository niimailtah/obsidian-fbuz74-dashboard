import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Command } from 'obsidian';
import {
    SampleView,
    SAMPLE_VIEW_TYPE,
} from "./ui/view";
// import { ObsidianIO } from "./ObsidianAdapter";

// Remember to rename these classes and interfaces!
interface FBUZ74DashboardPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: FBUZ74DashboardPluginSettings = {
    mySetting: 'default'
}

const command: Command = {
    id: 'my-command',
    name: 'My Command'
}

export default class FBUZ74DashboardPlugin extends Plugin {
    settings: FBUZ74DashboardPluginSettings;

    async activateView() {
        const leaves = this.app.workspace.getLeavesOfType(SAMPLE_VIEW_TYPE);
        if (leaves.length === 0) { // похоже, этот код для активации view в sidebar-е
            const leaf = this.app.workspace.getLeaf("tab");
            await leaf.setViewState({
                type: SAMPLE_VIEW_TYPE,
                active: true,
            });
        } else {
            await Promise.all(
                leaves.map((l) => {
                    (l.view as SampleView).onOpen();
                    this.app.workspace.setActiveLeaf(l);
                })
            );
        }
    }

    async onload() {
        await this.loadSettings();
        // This creates an icon in the left ribbon.
        const ribbonIconEl = this.addRibbonIcon('dice', 'FBUZ74 Dashboard Plugin', async (evt: MouseEvent) => {
            // Called when the user clicks the icon.
            new Notice('FBUZ74 Dashboard');

            await this.activateView();
        });
        // Perform additional things with the ribbon
        ribbonIconEl.addClass('my-plugin-ribbon-class');

        this.registerViews();

        // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
        const statusBarItemEl = this.addStatusBarItem();
        statusBarItemEl.setText('Status Bar Text');

        this.registerCommands();

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new FBUZ74DashboardSettingTab(this.app, this));

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.
        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            console.log('click', evt);
        });

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    private registerViews() {
        this.registerView(
            SAMPLE_VIEW_TYPE,
            (leaf) => new SampleView(leaf, this)
        );
    }

    private registerCommands() {
        this.addCommand(command);

        // This adds a simple command that can be triggered anywhere
        this.addCommand({
            id: 'open-sample-modal-simple',
            name: 'Open sample modal (simple)',
            callback: () => {
                new SampleModal(this.app).open();
            }
        });
        // This adds an editor command that can perform some operation on the current editor instance
        this.addCommand({
            id: 'sample-editor-command',
            name: 'Sample editor command',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                console.log(editor.getSelection());
                editor.replaceSelection('Sample Editor Command');
            }
        });
        // This adds a complex command that can check whether the current state of the app allows execution of the command
        this.addCommand({
            id: 'open-sample-modal-complex',
            name: 'Open sample modal (complex)',
            checkCallback: (checking: boolean) => {
                // Conditions to check
                const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (markdownView) {
                    // If checking is true, we're simply "checking" if the command can be run.
                    // If checking is false, then we want to actually perform the operation.
                    if (!checking) {
                        new SampleModal(this.app).open();
                    }

                    // This command will only show up in Command Palette when the check function returns true
                    return true;
                }
            }
        });
    }
}

class SampleModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.setText('Woah!');
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class FBUZ74DashboardSettingTab extends PluginSettingTab {
    plugin: FBUZ74DashboardPlugin;

    constructor(app: App, plugin: FBUZ74DashboardPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc('It\'s a secret')
            .addText(text => text
                .setPlaceholder('Enter your secret')
                .setValue(this.plugin.settings.mySetting)
                .onChange(async (value) => {
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));
    }
}
