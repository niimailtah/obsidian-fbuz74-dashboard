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
import { ObsidianIO } from "../ObsidianAdapter";
import MyPlugin from "../main";

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

export const SAMPLE_VIEW_TYPE = "sample-view";

export class SampleView extends ItemView {
    plugin: MyPlugin;
    hasCreated: boolean;
    result: string;

    constructor(
        leaf: WorkspaceLeaf,
        plugin: MyPlugin
    ) {
        super(leaf);
        this.plugin = plugin;
        this.hasCreated = false;
        this.result = "";
    }

    getViewType() {
        return SAMPLE_VIEW_TYPE;
    }

    getDisplayText() {
        return "Sample Plugin";
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
        if (!await this.app.vault.getAbstractFileByPath(`${rootFolderName}/${folderName}`)) {
            // if path doesnt exist, create folders
            await this.app.vault.createFolder(`${rootFolderName}/${folderName}`)
        }
        // создаем файл по шаблону и возвращаем TFile
        const newFile: TFile = await tp.file.create_new(templateFile,
            `${folderName}/${fileName}`,
            false,
            rootFolder);

        // создаем пустую новую заклвдку WorkspaceLeaf
        const leaf: WorkspaceLeaf = this.app.workspace.getLeaf(true);
        // загружаем в закладку только что созданный файл
        await leaf.openFile(newFile);
        // перемещаем курсор
        const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
        if (editor) {
            const position: EditorPosition = { line: 1, ch: 1 };
            editor.setCursor(position);
        }
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
        this.createAndOpenFile(templateName, rootFolderName, folderName, fileName);
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
        this.createAndOpenFile(templateName, rootFolderName, folderName, fileName);
        new Notice(`Создан возврат ${payNumber}`);
    }

    async onOpen() {
        await this.plugin.loadSettings();
        console.log("SampleView::onOpen()...")

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
                                // проверяем на существование файла
                                let fullFileName = `${folderName}/${fileName}.md`;
                                //@ts-ignore
                                const tp = this.app.plugins.plugins["templater-obsidian"].templater.current_functions_object;

                                let noteExists = await tp.file.exists(fullFileName);
                                if (noteExists) {
                                    let tabFound = false;
                                    // пробегаемся по всем листам в том числе и закладкам
                                    this.app.workspace.iterateAllLeaves(leaf => {
                                        const viewState = leaf.getViewState()
                                        // ищем закладку с заметкой и с заданным именем
                                        if (viewState.type === 'markdown' &&
                                            viewState.state?.file?.endsWith(`${fileName}.md`)) {
                                            // Активируем найденную закладку
                                            this.app.workspace.setActiveLeaf(leaf);
                                            tabFound = true;
                                        }
                                    });
                                    if (!tabFound) {
                                        // объект TFile, ссылающийся на заметку
                                        const folderOrFile = app.vault.getAbstractFileByPath(fullFileName);
                                        if (folderOrFile instanceof TFile) {
                                            // создаем пустую новую заклвдку WorkspaceLeaf
                                            let leaf = this.app.workspace.getLeaf(true);
                                            // загружаем а закладку только что созданный файл
                                            await leaf.openFile(folderOrFile);
                                        } else if (folderOrFile instanceof TFolder) {
                                            console.log("It's a folder!");
                                        }
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
                                // проверяем на существование файла
                                let fullFileName = `${folderName}/${fileName}.md`;
                                // Магия вызова API плагина Templater
                                // const templater = this.app.plugins.plugins["templater-obsidian"].templater;
                                // let tp = templater.functions_generator.internal_functions.modules_array;
                                // let tp_file = tp.find(module => module.name == "file");
                                // let tp_fileExists = tp_file.static_functions.get("exists");

                                // let noteExists = await tp_fileExists(fullFileName);
                                //@ts-ignore
                                const tp = this.app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
                                let noteExists = await tp.file.exists(fullFileName);
                                if (noteExists) {
                                    let tabFound = false;
                                    // пробегаемся по всем листам в том числе и закладкам
                                    this.app.workspace.iterateAllLeaves(leaf => {
                                        const viewState = leaf.getViewState()
                                        // ищем закладку с заметкой и с заданным именем
                                        if (viewState.type === 'markdown' &&
                                            viewState.state?.file?.endsWith(`${fileName}.md`)) {
                                            // Активируем найденную закладку
                                            this.app.workspace.setActiveLeaf(leaf);
                                            tabFound = true;
                                        }
                                    });
                                    if (!tabFound) {
                                        // объект TFile, ссылающийся на заметку
                                        const folderOrFile = app.vault.getAbstractFileByPath(fullFileName);
                                        if (folderOrFile instanceof TFile) {
                                            // создаем пустую новую заклвдку WorkspaceLeaf
                                            let leaf = this.app.workspace.getLeaf(true);
                                            // загружаем а закладку только что созданный файл
                                            await leaf.openFile(folderOrFile);
                                        } else if (folderOrFile instanceof TFolder) {
                                            console.log("It's a folder!");
                                        }
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
        const app = new ObsidianIO(this.app);
        const path = "delete_me.md";
        const file = app.getFileByPath(path);
        if (!file) {
            throw new Error(`File ${path} not found.`);
        }
        app.delete(file);
    }

    async onunload() {
    }
}
