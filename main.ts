import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Command } from 'obsidian';
import {
    DashboardView,
    DASHBOARD_VIEW_TYPE
} from "./ui/view";

// Remember to rename these classes and interfaces!
interface FBUZ74DashboardPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: FBUZ74DashboardPluginSettings = {
    mySetting: 'default'
}

export default class FBUZ74DashboardPlugin extends Plugin {
    settings: FBUZ74DashboardPluginSettings;

    async activateView() {
        const leaves = this.app.workspace.getLeavesOfType(DASHBOARD_VIEW_TYPE);
        if (leaves.length === 0) { // похоже, этот код для активации view в sidebar-е
            const leaf = this.app.workspace.getLeaf("tab");
            await leaf.setViewState({
                type: DASHBOARD_VIEW_TYPE,
                active: true,
            });
        } else {
            await Promise.all(
                leaves.map((l) => {
                    (l.view as DashboardView).onOpen();
                    this.app.workspace.setActiveLeaf(l);
                })
            );
        }
    }

    async onload() {
        await this.loadSettings();
        // This creates an icon in the left ribbon.
        const ribbonIconEl = this.addRibbonIcon('calendar-plus', 'FBUZ74 Dashboard Plugin', async (evt: MouseEvent) => {
            // Called when the user clicks the icon.
            new Notice('FBUZ74 Dashboard');
            await this.activateView();
        });
        // Perform additional things with the ribbon
        ribbonIconEl.addClass('my-plugin-ribbon-class');

        this.registerViews();
        this.registerCommands();

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new FBUZ74DashboardSettingTab(this.app, this));
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
            DASHBOARD_VIEW_TYPE,
            (leaf) => new DashboardView(leaf, this)
        );
    }

    private registerCommands() {
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
