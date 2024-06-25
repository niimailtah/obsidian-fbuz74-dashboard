import {
    View,
    Plugin,
    MarkdownView,
    ItemView,
    Menu,
    Notice,
    WorkspaceLeaf,
    MarkdownRenderer,
    TFile,
    TFolder,
    EditorPosition
} from "obsidian";
// import { App, MarkdownView } from "obsidian-typings";
import {
    ContractModalProps, ContractModal,
    RefundModalProps, RefundModal,
} from "./modal";
import FBUZ74DashboardPlugin from "../main";
import {
    openOrSwitch,
    addMD,
    wait
} from "obsidian-community-lib"

declare interface UserScriptFunctions {
    readonly load_user_script_function: (
        file: TFile,
        user_script_functions: Map<string, () => unknown>,
    ) => PromiseLike<void>
}

declare interface UserFunctions {
    readonly user_script_functions: UserScriptFunctions
}

declare interface FunctionsGenerator {
    readonly user_functions: UserFunctions
}

declare interface Templater {
    readonly functions_generator: FunctionsGenerator
    readonly current_functions_object: Record<string, unknown>;
}

declare interface TemplaterPlugin extends Plugin {
    readonly templater: Templater
}

export const DASHBOARD_VIEW_TYPE = "dashboard-view";

export class DashboardView extends ItemView {
    plugin: FBUZ74DashboardPlugin;
    hasCreated: boolean;
    result: string;

    constructor(
        leaf: WorkspaceLeaf,
        plugin: FBUZ74DashboardPlugin
    ) {
        super(leaf);
        this.plugin = plugin;
        this.hasCreated = false;
        this.result = "";
    }

    getViewType() {
        return DASHBOARD_VIEW_TYPE;
    }

    getDisplayText() {
        return "ФБУЗ ЦГиЭ Dashboard";
    }

    async createAndOpenFile(
        templateName: string,
        rootFolderName: string,
        folderName: string,
        fileName: string
    ) {
        //@ts-ignore
        const tp = this.app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
        const templateFile: TFile = tp.file.find_tfile(templateName);
        const rootFolder = this.app.vault.getAbstractFileByPath(rootFolderName);

        // if path doesnt exist, create folders
        if (!this.app.vault.getAbstractFileByPath(`${rootFolderName}/${folderName}`)) {
            await this.app.vault.createFolder(`${rootFolderName}/${folderName}`)
        }
        if (!this.app.vault.getAbstractFileByPath(`${rootFolderName}/${folderName}/${addMD(fileName)}`)) {
            // создаем файл по шаблону и возвращаем TFile
            await tp.file.create_new(templateFile,
                `${folderName}/${fileName}`,
                false,
                rootFolder);
        }
        let tabFound: boolean = false;
        // пробегаемся по всем листам в том числе и закладкам
        this.app.workspace.iterateAllLeaves(leaf => {
            const viewState = leaf.getViewState()
            // ищем закладку с заметкой с заданным именем
            if (viewState.type === 'markdown' &&
                viewState.state?.file?.startsWith(rootFolderName) &&
                viewState.state?.file?.endsWith(`${addMD(fileName)}`)) {
                // Активируем найденную закладку
                this.app.workspace.setActiveLeaf(leaf);
                tabFound = true;
            }
        });
        if (!tabFound) {
            await openOrSwitch(`${rootFolderName}/${folderName}/${fileName}`,
                new MouseEvent("mouseover"),
                { createNewFile: false });
        }
        // // перемещаем курсор
        // const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
        // if (editor) {
        //     const position: EditorPosition = { line: 1, ch: 1 };
        //     editor.setCursor(position);
        // }
    }

    async createNote(section: string) {
        //@ts-ignore
        const tp = this.app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
        let templateName = "";
        let rootFolderName = "";
        const folderName: string = `${tp.date.now('YYYY')}/`
            + `${tp.date.now('MM')} (${tp.user.nsd().getMonthName(tp.date.now('MM'))})/`
            + tp.date.now('DD.MM.YYYY');
        // имя файла = сегодняшняя дата в определенном формате
        const fileName: string = tp.date.now('YYYY-MM-DD');

        if (section === "gigtest") {
            templateName = "nsd_template_gt";
            rootFolderName = "GigTest"
        } else if (section === "fbuz74") {
            templateName = "nsd_template_site";
            rootFolderName = "FBUZ_74";
        } else if (section === "org") {
            templateName = "nsd_template_org";
            rootFolderName = "Organization";
        } else if (section === "soft") {
            templateName = "nsd_template_soft";
            rootFolderName = "Soft";
        }
        // let position: EditorPosition = { line: 8, ch: 3 };
        this.createAndOpenFile(templateName, rootFolderName, folderName, fileName);
    }

    async createContract(contractNumber: number, contractDate: string) {
        // const templater: TemplaterPlugin = this.app.plugins.plugins["templater-obsidian"];
        //@ts-ignore
        const tp = this.app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
        const templateName = 'contract';
        const rootFolderName = 'GigTest';
        const folderName = `Договоры/contracts/${tp.date.now('YYYY')}-${tp.date.now('MM')}/`
            + tp.date.now('YYYY-MM-DD');
        const fileName = `${contractNumber}_${contractDate}`;

        tp.user.pass_vars().setGlobalVar({
            contractNumber: contractNumber,
            contractDate: contractDate
        });
        await this.createAndOpenFile(templateName, rootFolderName, folderName, fileName);
        new Notice(`Создан договор ${contractNumber} от ${contractDate}`);
    }

    async createRefund(payNumber: number) {
        //@ts-ignore
        const tp = this.app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
        const templateName = 'refund';
        const rootFolderName = 'GigTest';
        const folderName = `Возвраты/refunds/${tp.date.now('YYYY')}-${tp.date.now('MM')}/`
            + tp.date.now('YYYY-MM-DD');
        const fileName = `${payNumber}`;

        tp.user.pass_vars().setGlobalVar({
            refundNumber: payNumber
        });
        await this.createAndOpenFile(templateName, rootFolderName, folderName, fileName);
        new Notice(`Создан возврат ${payNumber}`);
    }

    async onOpen() {
        await this.plugin.loadSettings();

        if (!this.hasCreated) {
            // this.containerEl.addClass("conductor-notes-modal");

            const conductor = this.contentEl.createDiv("conductor");
            conductor.createDiv({ cls: "section", attr: { "id": "gigtest" } }, (sectionEl) => {
                sectionEl
                    .createEl("h1", {
                        text: "🔧ГИГТЕСТ"
                    });
                sectionEl
                    .createDiv("commands", (commandBtns) => {
                        commandBtns
                            .createEl("button", {
                                cls: "gigtest-button",
                                text: "Создать заметку",
                            })
                            .addEventListener("click", async (e) => {
                                new Notice("Создать заметку");
                                this.createNote("gigtest");
                            });
                        commandBtns
                            .createEl("button", {
                                cls: "gigtest-button",
                                text: "Посмотреть договоры",
                            })
                            .addEventListener("click", async (e) => {
                                new Notice("Посмотреть договоры");

                                const folderName = "GigTest/Договоры";
                                const fileName = "contracts"
                                let fullFileName = `${folderName}/${addMD(fileName)}`;

                                if (!this.app.vault.getAbstractFileByPath(fullFileName)) {
                                    console.log(`File ${fullFileName} doesn't found`);
                                }
                                else {
                                    let tabFound: boolean = false;
                                    // пробегаемся по всем листам в том числе и закладкам
                                    this.app.workspace.iterateAllLeaves(leaf => {
                                        const viewState = leaf.getViewState()
                                        // ищем закладку с заметкой с заданным именем
                                        if (viewState.type === 'markdown' &&
                                            viewState.state?.file == fullFileName) {
                                            // Активируем найденную закладку
                                            this.app.workspace.setActiveLeaf(leaf);
                                            tabFound = true;
                                        }
                                    });
                                    if (!tabFound) {
                                        await openOrSwitch(fullFileName,
                                            new MouseEvent("mouseover"),
                                            { createNewFile: false });
                                    }
                                }
                            });
                        commandBtns
                            .createEl("button", {
                                cls: "gigtest-button",
                                text: "Создать договор",
                            })
                            .addEventListener("click", async (e) => {
                                new Notice("Создать договор");
                                new ContractModal(this.app,
                                    { title: "Создание договора", text: "Заполните номер и дату договора" },
                                    async (num, date) => {
                                        this.createContract(Number(num), date);
                                    }).open();
                            });
                        commandBtns
                            .createEl("button", {
                                cls: "gigtest-button",
                                text: "Посмотреть возвраты",
                            })
                            .addEventListener("click", async (e) => {
                                new Notice("Посмотреть возвраты");

                                const folderName = "GigTest/Возвраты";
                                const fileName = "refunds"
                                let fullFileName = `${folderName}/${addMD(fileName)}`;

                                if (!this.app.vault.getAbstractFileByPath(fullFileName)) {
                                    console.log(`File ${fullFileName} doesn't found`);
                                }
                                else {
                                    let tabFound: boolean = false;
                                    this.app.workspace.iterateAllLeaves(leaf => {
                                        const viewState = leaf.getViewState()
                                        if (viewState.type === 'markdown' &&
                                            viewState.state?.file == fullFileName) {
                                            this.app.workspace.setActiveLeaf(leaf);
                                            tabFound = true;
                                        }
                                    });
                                    if (!tabFound) {
                                        await openOrSwitch(fullFileName,
                                            new MouseEvent("mouseover"),
                                            { createNewFile: false });
                                    }
                                }
                            });
                        commandBtns
                            .createEl("button", {
                                cls: "gigtest-button",
                                text: "Создать возарат",
                            })
                            .addEventListener("click", async (e) => {
                                new Notice("Создать возарат");
                                new RefundModal(this.app,
                                    { title: "Создание возврата", text: "Заполните номер платежа для возврата ДС" },
                                    async (num) => {
                                        this.createRefund(Number(num));
                                    }).open();

                            });
                    });
            });
            conductor.createDiv({ cls: "section", attr: { "id": "fbuz74" } }, (sectionEl) => {
                sectionEl
                    .createEl("h1", {
                        text: "🌐FBUZ74"
                    });
                sectionEl
                    .createDiv("commands", (commandBtns) => {
                        commandBtns
                            .createEl("button", {
                                cls: "fbuz74-button",
                                text: "Создать заметку",
                            })
                            .addEventListener("click", async (e) => {
                                new Notice("Создать заметку");
                                this.createNote("fbuz74");
                            });
                    });
            });
            conductor.createDiv({ cls: "section", attr: { "id": "soft" } }, (sectionEl) => {
                sectionEl
                    .createEl("h1", {
                        text: "💻Soft"
                    });
                sectionEl
                    .createDiv("commands", (commandBtns) => {
                        commandBtns
                            .createEl("button", {
                                cls: "soft-button",
                                text: "Создать заметку",
                            })
                            .addEventListener("click", async (e) => {
                                new Notice("Создать заметку");
                                this.createNote("soft");
                            });
                    });
            });
            conductor.createDiv({ cls: "section", attr: { "id": "org" } }, (sectionEl) => {
                sectionEl
                    .createEl("h1", {
                        text: "🛠Organization"
                    });
                sectionEl
                    .createDiv("commands", (commandBtns) => {
                        commandBtns
                            .createEl("button", {
                                cls: "org-button",
                                text: "Создать заметку",
                            })
                            .addEventListener("click", async (e) => {
                                new Notice("Создать заметку");
                                this.createNote("org");
                            });
                    });
            });

            this.hasCreated = true;
        }
    }

    async onunload() {
    }
}
