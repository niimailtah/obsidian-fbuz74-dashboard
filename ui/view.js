import { __awaiter } from "tslib";
import { MarkdownView, ItemView, Notice, TFile, TFolder } from "obsidian";
// import { App, MarkdownView } from "obsidian-typings";
import { ContractModal, RefundModal, } from "./modal";
import { ObsidianIO } from "../ObsidianAdapter";
export const SAMPLE_VIEW_TYPE = "sample-view";
export class SampleView extends ItemView {
    constructor(leaf, plugin) {
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
    createAndOpenFile(templateName, rootFolderName, folderName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            //@ts-ignore
            const tp = this.app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
            const templateFile = tp.file.find_tfile(templateName);
            const rootFolder = this.app.vault.getAbstractFileByPath(rootFolderName);
            if (!(yield this.app.vault.getAbstractFileByPath(`${rootFolderName}/${folderName}`))) {
                // if path doesnt exist, create folders
                yield this.app.vault.createFolder(`${rootFolderName}/${folderName}`);
            }
            // создаем файл по шаблону и возвращаем TFile
            const newFile = yield tp.file.create_new(templateFile, `${folderName}/${fileName}`, false, rootFolder);
            // создаем пустую новую заклвдку WorkspaceLeaf
            const leaf = this.app.workspace.getLeaf(true);
            // загружаем в закладку только что созданный файл
            yield leaf.openFile(newFile);
            // перемещаем курсор
            const editor = (_a = this.app.workspace.getActiveViewOfType(MarkdownView)) === null || _a === void 0 ? void 0 : _a.editor;
            if (editor) {
                const position = { line: 1, ch: 1 };
                editor.setCursor(position);
            }
        });
    }
    createNote(section) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const tp = this.app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
            let templateName = "";
            let rootFolderName = "";
            const folderName = `${tp.date.now('YYYY')}/`
                + `${tp.date.now('MM')} (${tp.user.nsd().getMonthName(tp.date.now('MM'))})/`
                + tp.date.now('DD.MM.YYYY');
            // имя файла = сегодняшняя дата в определенном формате
            const fileName = tp.date.now('YYYY-MM-DD');
            if (section === "gigtest") {
                templateName = "nsd_template_gt";
                rootFolderName = "GigTest";
            }
            else if (section === "fbuz74") {
                templateName = "nsd_template_site";
                rootFolderName = "FBUZ_74";
            }
            else if (section === "org") {
                templateName = "nsd_template_org";
                rootFolderName = "Organization";
            }
            else if (section === "soft") {
                templateName = "nsd_template_soft";
                rootFolderName = "Soft";
            }
            // let position: EditorPosition = { line: 8, ch: 3 };
            this.createAndOpenFile(templateName, rootFolderName, folderName, fileName);
        });
    }
    createContract(contractNumber, contractDate) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    createRefund(payNumber) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    onOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.plugin.loadSettings();
            console.log("SampleView::onOpen()...");
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
                            .addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                            new Notice("Создать заметку");
                            this.createNote("gigtest");
                        }));
                        commandBtns
                            .createEl("button", {
                            cls: "gigtest-button",
                            text: "Посмотреть договоры",
                        })
                            .addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                            new Notice("Посмотреть договоры");
                            const folderName = "GigTest/Договоры";
                            const fileName = "contracts";
                            // проверяем на существование файла
                            let fullFileName = `${folderName}/${fileName}.md`;
                            //@ts-ignore
                            const tp = this.app.plugins.plugins["templater-obsidian"].templater.current_functions_object;
                            let noteExists = yield tp.file.exists(fullFileName);
                            if (noteExists) {
                                let tabFound = false;
                                // пробегаемся по всем листам в том числе и закладкам
                                this.app.workspace.iterateAllLeaves(leaf => {
                                    var _a, _b;
                                    const viewState = leaf.getViewState();
                                    // ищем закладку с заметкой и с заданным именем
                                    if (viewState.type === 'markdown' &&
                                        ((_b = (_a = viewState.state) === null || _a === void 0 ? void 0 : _a.file) === null || _b === void 0 ? void 0 : _b.endsWith(`${fileName}.md`))) {
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
                                        yield leaf.openFile(folderOrFile);
                                    }
                                    else if (folderOrFile instanceof TFolder) {
                                        console.log("It's a folder!");
                                    }
                                }
                            }
                        }));
                        commandBtns
                            .createEl("button", {
                            cls: "gigtest-button",
                            text: "Создать договор",
                        })
                            .addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                            new Notice("Создать договор");
                            new ContractModal(this.app, { title: "Создание договора", text: "Заполните номер и дату договора" }, (num, date) => __awaiter(this, void 0, void 0, function* () {
                                this.createContract(Number(num), date);
                            })).open();
                        }));
                        commandBtns
                            .createEl("button", {
                            cls: "gigtest-button",
                            text: "Посмотреть возвраты",
                        })
                            .addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                            new Notice("Посмотреть возвраты");
                            const folderName = "GigTest/Возвраты";
                            const fileName = "refunds";
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
                            let noteExists = yield tp.file.exists(fullFileName);
                            if (noteExists) {
                                let tabFound = false;
                                // пробегаемся по всем листам в том числе и закладкам
                                this.app.workspace.iterateAllLeaves(leaf => {
                                    var _a, _b;
                                    const viewState = leaf.getViewState();
                                    // ищем закладку с заметкой и с заданным именем
                                    if (viewState.type === 'markdown' &&
                                        ((_b = (_a = viewState.state) === null || _a === void 0 ? void 0 : _a.file) === null || _b === void 0 ? void 0 : _b.endsWith(`${fileName}.md`))) {
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
                                        yield leaf.openFile(folderOrFile);
                                    }
                                    else if (folderOrFile instanceof TFolder) {
                                        console.log("It's a folder!");
                                    }
                                }
                            }
                        }));
                        commandBtns
                            .createEl("button", {
                            cls: "gigtest-button",
                            text: "Создать возарат",
                        })
                            .addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                            new Notice("Создать возарат");
                            new RefundModal(this.app, { title: "Создание возврата", text: "Заполните номер платежа для возврата ДС" }, (num) => __awaiter(this, void 0, void 0, function* () {
                                this.createRefund(Number(num));
                            })).open();
                        }));
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
                            .addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                            new Notice("Создать заметку");
                            this.createNote("fbuz74");
                        }));
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
                            .addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                            new Notice("Создать заметку");
                            this.createNote("soft");
                        }));
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
                            .addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                            new Notice("Создать заметку");
                            this.createNote("org");
                        }));
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
        });
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFHSCxZQUFZLEVBQ1osUUFBUSxFQUVSLE1BQU0sRUFHTixLQUFLLEVBQ0wsT0FBTyxFQUVWLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLHdEQUF3RDtBQUN4RCxPQUFPLEVBQ2lCLGFBQWEsRUFDZixXQUFXLEdBQ2hDLE1BQU0sU0FBUyxDQUFDO0FBQ2pCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQTJCaEQsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsYUFBYSxDQUFDO0FBRTlDLE1BQU0sT0FBTyxVQUFXLFNBQVEsUUFBUTtJQUtwQyxZQUNJLElBQW1CLEVBQ25CLE1BQWdCO1FBRWhCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxXQUFXO1FBQ1AsT0FBTyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0lBRUQsY0FBYztRQUNWLE9BQU8sZUFBZSxDQUFDO0lBQzNCLENBQUM7SUFFSyxpQkFBaUIsQ0FDbkIsWUFBb0IsRUFDcEIsY0FBc0IsRUFDdEIsVUFBa0IsRUFDbEIsUUFBZ0I7OztZQUVoQixZQUFZO1lBQ1osTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1lBQzdGLE1BQU0sWUFBWSxHQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzdELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FB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LEVBQUU7d0JBQ1osSUFBSSxFQUFFLGdCQUFnQjtxQkFDekIsQ0FBQyxDQUFDO29CQUNQLFNBQVM7eUJBQ0osU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFO3dCQUNuQyxXQUFXOzZCQUNOLFFBQVEsQ0FBQyxRQUFRLEVBQUU7NEJBQ2hCLEdBQUcsRUFBRSxZQUFZOzRCQUNqQixJQUFJLEVBQUUsaUJBQWlCO3lCQUMxQixDQUFDOzZCQUNELGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFPLENBQUMsRUFBRSxFQUFFOzRCQUNuQyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOzRCQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUMzQixDQUFDLENBQUEsQ0FBQyxDQUFDO29CQUNYLENBQUMsQ0FBQyxDQUFDO2dCQUNYLENBQUMsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQzNCLENBQUM7WUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckMsTUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDO1lBQzVCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLGFBQWEsQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLENBQUM7S0FBQTtJQUVLLFFBQVE7O1FBQ2QsQ0FBQztLQUFBO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgVmlldyxcclxuICAgIFBsdWdpbixcclxuICAgIE1hcmtkb3duVmlldyxcclxuICAgIEl0ZW1WaWV3LFxyXG4gICAgTWVudSxcclxuICAgIE5vdGljZSxcclxuICAgIFdvcmtzcGFjZUxlYWYsXHJcbiAgICBNYXJrZG93blJlbmRlcmVyLFxyXG4gICAgVEZpbGUsXHJcbiAgICBURm9sZGVyLFxyXG4gICAgRWRpdG9yUG9zaXRpb25cclxufSBmcm9tIFwib2JzaWRpYW5cIjtcclxuLy8gaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcgfSBmcm9tIFwib2JzaWRpYW4tdHlwaW5nc1wiO1xyXG5pbXBvcnQge1xyXG4gICAgQ29udHJhY3RNb2RhbFByb3BzLCBDb250cmFjdE1vZGFsLFxyXG4gICAgUmVmdW5kTW9kYWxQcm9wcywgUmVmdW5kTW9kYWwsXHJcbn0gZnJvbSBcIi4vbW9kYWxcIjtcclxuaW1wb3J0IHsgT2JzaWRpYW5JTyB9IGZyb20gXCIuLi9PYnNpZGlhbkFkYXB0ZXJcIjtcclxuaW1wb3J0IE15UGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XHJcblxyXG5kZWNsYXJlIGludGVyZmFjZSBVc2VyU2NyaXB0RnVuY3Rpb25zIHtcclxuICAgIHJlYWRvbmx5IGxvYWRfdXNlcl9zY3JpcHRfZnVuY3Rpb246IChcclxuICAgICAgICBmaWxlOiBURmlsZSxcclxuICAgICAgICB1c2VyX3NjcmlwdF9mdW5jdGlvbnM6IE1hcDxzdHJpbmcsICgpID0+IHVua25vd24+LFxyXG4gICAgKSA9PiBQcm9taXNlTGlrZTx2b2lkPlxyXG59XHJcblxyXG5kZWNsYXJlIGludGVyZmFjZSBVc2VyRnVuY3Rpb25zIHtcclxuICAgIHJlYWRvbmx5IHVzZXJfc2NyaXB0X2Z1bmN0aW9uczogVXNlclNjcmlwdEZ1bmN0aW9uc1xyXG59XHJcblxyXG5kZWNsYXJlIGludGVyZmFjZSBGdW5jdGlvbnNHZW5lcmF0b3Ige1xyXG4gICAgcmVhZG9ubHkgdXNlcl9mdW5jdGlvbnM6IFVzZXJGdW5jdGlvbnNcclxufVxyXG5cclxuZGVjbGFyZSBpbnRlcmZhY2UgVGVtcGxhdGVyIHtcclxuICAgIHJlYWRvbmx5IGZ1bmN0aW9uc19nZW5lcmF0b3I6IEZ1bmN0aW9uc0dlbmVyYXRvclxyXG4gICAgcmVhZG9ubHkgY3VycmVudF9mdW5jdGlvbnNfb2JqZWN0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcclxufVxyXG5cclxuZGVjbGFyZSBpbnRlcmZhY2UgVGVtcGxhdGVyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuICAgIHJlYWRvbmx5IHRlbXBsYXRlcjogVGVtcGxhdGVyXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBTQU1QTEVfVklFV19UWVBFID0gXCJzYW1wbGUtdmlld1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNhbXBsZVZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XHJcbiAgICBwbHVnaW46IE15UGx1Z2luO1xyXG4gICAgaGFzQ3JlYXRlZDogYm9vbGVhbjtcclxuICAgIHJlc3VsdDogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGxlYWY6IFdvcmtzcGFjZUxlYWYsXHJcbiAgICAgICAgcGx1Z2luOiBNeVBsdWdpblxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIobGVhZik7XHJcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XHJcbiAgICAgICAgdGhpcy5oYXNDcmVhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZXN1bHQgPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFZpZXdUeXBlKCkge1xyXG4gICAgICAgIHJldHVybiBTQU1QTEVfVklFV19UWVBFO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpc3BsYXlUZXh0KCkge1xyXG4gICAgICAgIHJldHVybiBcIlNhbXBsZSBQbHVnaW5cIjtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBjcmVhdGVBbmRPcGVuRmlsZShcclxuICAgICAgICB0ZW1wbGF0ZU5hbWU6IHN0cmluZyxcclxuICAgICAgICByb290Rm9sZGVyTmFtZTogc3RyaW5nLFxyXG4gICAgICAgIGZvbGRlck5hbWU6IHN0cmluZyxcclxuICAgICAgICBmaWxlTmFtZTogc3RyaW5nXHJcbiAgICApIHtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBjb25zdCB0cCA9IHRoaXMuYXBwLnBsdWdpbnMucGx1Z2luc1tcInRlbXBsYXRlci1vYnNpZGlhblwiXS50ZW1wbGF0ZXIuY3VycmVudF9mdW5jdGlvbnNfb2JqZWN0O1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlRmlsZTogVEZpbGUgPSB0cC5maWxlLmZpbmRfdGZpbGUodGVtcGxhdGVOYW1lKTtcclxuICAgICAgICBjb25zdCByb290Rm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJvb3RGb2xkZXJOYW1lKTtcclxuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChgJHtyb290Rm9sZGVyTmFtZX0vJHtmb2xkZXJOYW1lfWApKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHBhdGggZG9lc250IGV4aXN0LCBjcmVhdGUgZm9sZGVyc1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoYCR7cm9vdEZvbGRlck5hbWV9LyR7Zm9sZGVyTmFtZX1gKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDRgdC+0LfQtNCw0LXQvCDRhNCw0LnQuyDQv9C+INGI0LDQsdC70L7QvdGDINC4INCy0L7Qt9Cy0YDQsNGJ0LDQtdC8IFRGaWxlXHJcbiAgICAgICAgY29uc3QgbmV3RmlsZTogVEZpbGUgPSBhd2FpdCB0cC5maWxlLmNyZWF0ZV9uZXcodGVtcGxhdGVGaWxlLFxyXG4gICAgICAgICAgICBgJHtmb2xkZXJOYW1lfS8ke2ZpbGVOYW1lfWAsXHJcbiAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICByb290Rm9sZGVyKTtcclxuXHJcbiAgICAgICAgLy8g0YHQvtC30LTQsNC10Lwg0L/Rg9GB0YLRg9GOINC90L7QstGD0Y4g0LfQsNC60LvQstC00LrRgyBXb3Jrc3BhY2VMZWFmXHJcbiAgICAgICAgY29uc3QgbGVhZjogV29ya3NwYWNlTGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKHRydWUpO1xyXG4gICAgICAgIC8vINC30LDQs9GA0YPQttCw0LXQvCDQsiDQt9Cw0LrQu9Cw0LTQutGDINGC0L7Qu9GM0LrQviDRh9GC0L4g0YHQvtC30LTQsNC90L3Ri9C5INGE0LDQudC7XHJcbiAgICAgICAgYXdhaXQgbGVhZi5vcGVuRmlsZShuZXdGaWxlKTtcclxuICAgICAgICAvLyDQv9C10YDQtdC80LXRidCw0LXQvCDQutGD0YDRgdC+0YBcclxuICAgICAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpPy5lZGl0b3I7XHJcbiAgICAgICAgaWYgKGVkaXRvcikge1xyXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbjogRWRpdG9yUG9zaXRpb24gPSB7IGxpbmU6IDEsIGNoOiAxIH07XHJcbiAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3IocG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBjcmVhdGVOb3RlKHNlY3Rpb246IHN0cmluZykge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGNvbnN0IHRwID0gdGhpcy5hcHAucGx1Z2lucy5wbHVnaW5zW1widGVtcGxhdGVyLW9ic2lkaWFuXCJdLnRlbXBsYXRlci5jdXJyZW50X2Z1bmN0aW9uc19vYmplY3Q7XHJcbiAgICAgICAgbGV0IHRlbXBsYXRlTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgbGV0IHJvb3RGb2xkZXJOYW1lID0gXCJcIjtcclxuICAgICAgICBjb25zdCBmb2xkZXJOYW1lOiBzdHJpbmcgPSBgJHt0cC5kYXRlLm5vdygnWVlZWScpfS9gXHJcbiAgICAgICAgICAgICsgYCR7dHAuZGF0ZS5ub3coJ01NJyl9ICgke3RwLnVzZXIubnNkKCkuZ2V0TW9udGhOYW1lKHRwLmRhdGUubm93KCdNTScpKX0pL2BcclxuICAgICAgICAgICAgKyB0cC5kYXRlLm5vdygnREQuTU0uWVlZWScpO1xyXG4gICAgICAgIC8vINC40LzRjyDRhNCw0LnQu9CwID0g0YHQtdCz0L7QtNC90Y/RiNC90Y/RjyDQtNCw0YLQsCDQsiDQvtC/0YDQtdC00LXQu9C10L3QvdC+0Lwg0YTQvtGA0LzQsNGC0LVcclxuICAgICAgICBjb25zdCBmaWxlTmFtZTogc3RyaW5nID0gdHAuZGF0ZS5ub3coJ1lZWVktTU0tREQnKTtcclxuXHJcbiAgICAgICAgaWYgKHNlY3Rpb24gPT09IFwiZ2lndGVzdFwiKSB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlTmFtZSA9IFwibnNkX3RlbXBsYXRlX2d0XCI7XHJcbiAgICAgICAgICAgIHJvb3RGb2xkZXJOYW1lID0gXCJHaWdUZXN0XCJcclxuICAgICAgICB9IGVsc2UgaWYgKHNlY3Rpb24gPT09IFwiZmJ1ejc0XCIpIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVOYW1lID0gXCJuc2RfdGVtcGxhdGVfc2l0ZVwiO1xyXG4gICAgICAgICAgICByb290Rm9sZGVyTmFtZSA9IFwiRkJVWl83NFwiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VjdGlvbiA9PT0gXCJvcmdcIikge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZU5hbWUgPSBcIm5zZF90ZW1wbGF0ZV9vcmdcIjtcclxuICAgICAgICAgICAgcm9vdEZvbGRlck5hbWUgPSBcIk9yZ2FuaXphdGlvblwiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VjdGlvbiA9PT0gXCJzb2Z0XCIpIHtcclxuICAgICAgICAgICAgdGVtcGxhdGVOYW1lID0gXCJuc2RfdGVtcGxhdGVfc29mdFwiO1xyXG4gICAgICAgICAgICByb290Rm9sZGVyTmFtZSA9IFwiU29mdFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBsZXQgcG9zaXRpb246IEVkaXRvclBvc2l0aW9uID0geyBsaW5lOiA4LCBjaDogMyB9O1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQW5kT3BlbkZpbGUodGVtcGxhdGVOYW1lLCByb290Rm9sZGVyTmFtZSwgZm9sZGVyTmFtZSwgZmlsZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGNyZWF0ZUNvbnRyYWN0KGNvbnRyYWN0TnVtYmVyOiBudW1iZXIsIGNvbnRyYWN0RGF0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgLy8gY29uc3QgdGVtcGxhdGVyOiBUZW1wbGF0ZXJQbHVnaW4gPSB0aGlzLmFwcC5wbHVnaW5zLnBsdWdpbnNbXCJ0ZW1wbGF0ZXItb2JzaWRpYW5cIl07XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgY29uc3QgdHAgPSB0aGlzLmFwcC5wbHVnaW5zLnBsdWdpbnNbXCJ0ZW1wbGF0ZXItb2JzaWRpYW5cIl0udGVtcGxhdGVyLmN1cnJlbnRfZnVuY3Rpb25zX29iamVjdDtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZU5hbWUgPSAnY29udHJhY3QnO1xyXG4gICAgICAgIGNvbnN0IHJvb3RGb2xkZXJOYW1lID0gJ0dpZ1Rlc3QnO1xyXG4gICAgICAgIGNvbnN0IGZvbGRlck5hbWUgPSBg0JTQvtCz0L7QstC+0YDRiy9jb250cmFjdHMvJHt0cC5kYXRlLm5vdygnWVlZWScpfS0ke3RwLmRhdGUubm93KCdNTScpfS9gXHJcbiAgICAgICAgICAgICsgdHAuZGF0ZS5ub3coJ1lZWVktTU0tREQnKTtcclxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGAke2NvbnRyYWN0TnVtYmVyfV8ke2NvbnRyYWN0RGF0ZX1gO1xyXG5cclxuICAgICAgICB0cC51c2VyLnBhc3NfdmFycygpLnNldEdsb2JhbFZhcih7XHJcbiAgICAgICAgICAgIGNvbnRyYWN0TnVtYmVyOiBjb250cmFjdE51bWJlcixcclxuICAgICAgICAgICAgY29udHJhY3REYXRlOiBjb250cmFjdERhdGVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUFuZE9wZW5GaWxlKHRlbXBsYXRlTmFtZSwgcm9vdEZvbGRlck5hbWUsIGZvbGRlck5hbWUsIGZpbGVOYW1lKTtcclxuICAgICAgICBuZXcgTm90aWNlKGDQodC+0LfQtNCw0L0g0LTQvtCz0L7QstC+0YAgJHtjb250cmFjdE51bWJlcn0g0L7RgiAke2NvbnRyYWN0RGF0ZX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBjcmVhdGVSZWZ1bmQocGF5TnVtYmVyOiBudW1iZXIpIHtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBjb25zdCB0cCA9IHRoaXMuYXBwLnBsdWdpbnMucGx1Z2luc1tcInRlbXBsYXRlci1vYnNpZGlhblwiXS50ZW1wbGF0ZXIuY3VycmVudF9mdW5jdGlvbnNfb2JqZWN0O1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlTmFtZSA9ICdyZWZ1bmQnO1xyXG4gICAgICAgIGNvbnN0IHJvb3RGb2xkZXJOYW1lID0gJ0dpZ1Rlc3QnO1xyXG4gICAgICAgIGNvbnN0IGZvbGRlck5hbWUgPSBg0JLQvtC30LLRgNCw0YLRiy9yZWZ1bmRzLyR7dHAuZGF0ZS5ub3coJ1lZWVknKX0tJHt0cC5kYXRlLm5vdygnTU0nKX0vYFxyXG4gICAgICAgICAgICArIHRwLmRhdGUubm93KCdZWVlZLU1NLUREJyk7XHJcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBgJHtwYXlOdW1iZXJ9YDtcclxuXHJcbiAgICAgICAgdHAudXNlci5wYXNzX3ZhcnMoKS5zZXRHbG9iYWxWYXIoe1xyXG4gICAgICAgICAgICByZWZ1bmROdW1iZXI6IHBheU51bWJlclxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQW5kT3BlbkZpbGUodGVtcGxhdGVOYW1lLCByb290Rm9sZGVyTmFtZSwgZm9sZGVyTmFtZSwgZmlsZU5hbWUpO1xyXG4gICAgICAgIG5ldyBOb3RpY2UoYNCh0L7Qt9C00LDQvSDQstC+0LfQstGA0LDRgiAke3BheU51bWJlcn1gKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbk9wZW4oKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ubG9hZFNldHRpbmdzKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTYW1wbGVWaWV3Ojpvbk9wZW4oKS4uLlwiKVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaGFzQ3JlYXRlZCkge1xyXG4gICAgICAgICAgICAvLyB0aGlzLmNvbnRhaW5lckVsLmFkZENsYXNzKFwiY29uZHVjdG9yLW5vdGVzLW1vZGFsXCIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29uZHVjdG9yID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KFwiY29uZHVjdG9yXCIpO1xyXG4gICAgICAgICAgICBjb25kdWN0b3IuY3JlYXRlRGl2KHsgY2xzOiBcInNlY3Rpb25cIiwgYXR0cjogeyBcImlkXCI6IFwiZ2lndGVzdFwiIH0gfSwgKHNlY3Rpb25FbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VjdGlvbkVsXHJcbiAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUVsKFwiaDFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIvCflKfQk9CY0JPQotCV0KHQolwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uRWxcclxuICAgICAgICAgICAgICAgICAgICAuY3JlYXRlRGl2KFwiY29tbWFuZHNcIiwgKGNvbW1hbmRCdG5zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRCdG5zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlRWwoXCJidXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsczogXCJnaWd0ZXN0LWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi0KHQvtC30LTQsNGC0Ywg0LfQsNC80LXRgtC60YNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcItCh0L7Qt9C00LDRgtGMINC30LDQvNC10YLQutGDXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTm90ZShcImdpZ3Rlc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZEJ0bnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jcmVhdGVFbChcImJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzOiBcImdpZ3Rlc3QtYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCLQn9C+0YHQvNC+0YLRgNC10YLRjCDQtNC+0LPQvtCy0L7RgNGLXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCLQn9C+0YHQvNC+0YLRgNC10YLRjCDQtNC+0LPQvtCy0L7RgNGLXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb2xkZXJOYW1lID0gXCJHaWdUZXN0L9CU0L7Qs9C+0LLQvtGA0YtcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IFwiY29udHJhY3RzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQv9GA0L7QstC10YDRj9C10Lwg0L3QsCDRgdGD0YnQtdGB0YLQstC+0LLQsNC90LjQtSDRhNCw0LnQu9CwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZ1bGxGaWxlTmFtZSA9IGAke2ZvbGRlck5hbWV9LyR7ZmlsZU5hbWV9Lm1kYDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0cCA9IHRoaXMuYXBwLnBsdWdpbnMucGx1Z2luc1tcInRlbXBsYXRlci1vYnNpZGlhblwiXS50ZW1wbGF0ZXIuY3VycmVudF9mdW5jdGlvbnNfb2JqZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm90ZUV4aXN0cyA9IGF3YWl0IHRwLmZpbGUuZXhpc3RzKGZ1bGxGaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vdGVFeGlzdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRhYkZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC/0YDQvtCx0LXQs9Cw0LXQvNGB0Y8g0L/QviDQstGB0LXQvCDQu9C40YHRgtCw0Lwg0LIg0YLQvtC8INGH0LjRgdC70LUg0Lgg0LfQsNC60LvQsNC00LrQsNC8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5pdGVyYXRlQWxsTGVhdmVzKGxlYWYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgdmlld1N0YXRlID0gbGVhZi5nZXRWaWV3U3RhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LfQsNC60LvQsNC00LrRgyDRgSDQt9Cw0LzQtdGC0LrQvtC5INC4INGBINC30LDQtNCw0L3QvdGL0Lwg0LjQvNC10L3QtdC8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmlld1N0YXRlLnR5cGUgPT09ICdtYXJrZG93bicgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3U3RhdGUuc3RhdGU/LmZpbGU/LmVuZHNXaXRoKGAke2ZpbGVOYW1lfS5tZGApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0JDQutGC0LjQstC40YDRg9C10Lwg0L3QsNC50LTQtdC90L3Rg9GOINC30LDQutC70LDQtNC60YNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRhYkZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQvtCx0YrQtdC60YIgVEZpbGUsINGB0YHRi9C70LDRjtGJ0LjQudGB0Y8g0L3QsCDQt9Cw0LzQtdGC0LrRg1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9sZGVyT3JGaWxlID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmdWxsRmlsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvbGRlck9yRmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0YHQvtC30LTQsNC10Lwg0L/Rg9GB0YLRg9GOINC90L7QstGD0Y4g0LfQsNC60LvQstC00LrRgyBXb3Jrc3BhY2VMZWFmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQt9Cw0LPRgNGD0LbQsNC10Lwg0LAg0LfQsNC60LvQsNC00LrRgyDRgtC+0LvRjNC60L4g0YfRgtC+INGB0L7Qt9C00LDQvdC90YvQuSDRhNCw0LnQu1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZm9sZGVyT3JGaWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9sZGVyT3JGaWxlIGluc3RhbmNlb2YgVEZvbGRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSXQncyBhIGZvbGRlciFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRCdG5zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlRWwoXCJidXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsczogXCJnaWd0ZXN0LWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi0KHQvtC30LTQsNGC0Ywg0LTQvtCz0L7QstC+0YBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcItCh0L7Qt9C00LDRgtGMINC00L7Qs9C+0LLQvtGAXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBDb250cmFjdE1vZGFsKHRoaXMuYXBwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiBcItCh0L7Qt9C00LDQvdC40LUg0LTQvtCz0L7QstC+0YDQsFwiLCB0ZXh0OiBcItCX0LDQv9C+0LvQvdC40YLQtSDQvdC+0LzQtdGAINC4INC00LDRgtGDINC00L7Qs9C+0LLQvtGA0LBcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAobnVtLCBkYXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbnRyYWN0KE51bWJlcihudW0pLCBkYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRCdG5zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlRWwoXCJidXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsczogXCJnaWd0ZXN0LWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi0J/QvtGB0LzQvtGC0YDQtdGC0Ywg0LLQvtC30LLRgNCw0YLRi1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwi0J/QvtGB0LzQvtGC0YDQtdGC0Ywg0LLQvtC30LLRgNCw0YLRi1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9sZGVyTmFtZSA9IFwiR2lnVGVzdC/QktC+0LfQstGA0LDRgtGLXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBcInJlZnVuZHNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC/0YDQvtCy0LXRgNGP0LXQvCDQvdCwINGB0YPRidC10YHRgtCy0L7QstCw0L3QuNC1INGE0LDQudC70LBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZnVsbEZpbGVOYW1lID0gYCR7Zm9sZGVyTmFtZX0vJHtmaWxlTmFtZX0ubWRgO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCc0LDQs9C40Y8g0LLRi9C30L7QstCwIEFQSSDQv9C70LDQs9C40L3QsCBUZW1wbGF0ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCB0ZW1wbGF0ZXIgPSB0aGlzLmFwcC5wbHVnaW5zLnBsdWdpbnNbXCJ0ZW1wbGF0ZXItb2JzaWRpYW5cIl0udGVtcGxhdGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCB0cCA9IHRlbXBsYXRlci5mdW5jdGlvbnNfZ2VuZXJhdG9yLmludGVybmFsX2Z1bmN0aW9ucy5tb2R1bGVzX2FycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCB0cF9maWxlID0gdHAuZmluZChtb2R1bGUgPT4gbW9kdWxlLm5hbWUgPT0gXCJmaWxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCB0cF9maWxlRXhpc3RzID0gdHBfZmlsZS5zdGF0aWNfZnVuY3Rpb25zLmdldChcImV4aXN0c1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0IG5vdGVFeGlzdHMgPSBhd2FpdCB0cF9maWxlRXhpc3RzKGZ1bGxGaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHAgPSB0aGlzLmFwcC5wbHVnaW5zLnBsdWdpbnNbXCJ0ZW1wbGF0ZXItb2JzaWRpYW5cIl0udGVtcGxhdGVyLmN1cnJlbnRfZnVuY3Rpb25zX29iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm90ZUV4aXN0cyA9IGF3YWl0IHRwLmZpbGUuZXhpc3RzKGZ1bGxGaWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vdGVFeGlzdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRhYkZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINC/0YDQvtCx0LXQs9Cw0LXQvNGB0Y8g0L/QviDQstGB0LXQvCDQu9C40YHRgtCw0Lwg0LIg0YLQvtC8INGH0LjRgdC70LUg0Lgg0LfQsNC60LvQsNC00LrQsNC8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5pdGVyYXRlQWxsTGVhdmVzKGxlYWYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgdmlld1N0YXRlID0gbGVhZi5nZXRWaWV3U3RhdGUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0LjRidC10Lwg0LfQsNC60LvQsNC00LrRgyDRgSDQt9Cw0LzQtdGC0LrQvtC5INC4INGBINC30LDQtNCw0L3QvdGL0Lwg0LjQvNC10L3QtdC8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmlld1N0YXRlLnR5cGUgPT09ICdtYXJrZG93bicgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3U3RhdGUuc3RhdGU/LmZpbGU/LmVuZHNXaXRoKGAke2ZpbGVOYW1lfS5tZGApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0JDQutGC0LjQstC40YDRg9C10Lwg0L3QsNC50LTQtdC90L3Rg9GOINC30LDQutC70LDQtNC60YNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRhYkZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQvtCx0YrQtdC60YIgVEZpbGUsINGB0YHRi9C70LDRjtGJ0LjQudGB0Y8g0L3QsCDQt9Cw0LzQtdGC0LrRg1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9sZGVyT3JGaWxlID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmdWxsRmlsZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvbGRlck9yRmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0YHQvtC30LTQsNC10Lwg0L/Rg9GB0YLRg9GOINC90L7QstGD0Y4g0LfQsNC60LvQstC00LrRgyBXb3Jrc3BhY2VMZWFmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQt9Cw0LPRgNGD0LbQsNC10Lwg0LAg0LfQsNC60LvQsNC00LrRgyDRgtC+0LvRjNC60L4g0YfRgtC+INGB0L7Qt9C00LDQvdC90YvQuSDRhNCw0LnQu1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZm9sZGVyT3JGaWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9sZGVyT3JGaWxlIGluc3RhbmNlb2YgVEZvbGRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSXQncyBhIGZvbGRlciFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRCdG5zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlRWwoXCJidXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsczogXCJnaWd0ZXN0LWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi0KHQvtC30LTQsNGC0Ywg0LLQvtC30LDRgNCw0YJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcItCh0L7Qt9C00LDRgtGMINCy0L7Qt9Cw0YDQsNGCXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBSZWZ1bmRNb2RhbCh0aGlzLmFwcCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogXCLQodC+0LfQtNCw0L3QuNC1INCy0L7Qt9Cy0YDQsNGC0LBcIiwgdGV4dDogXCLQl9Cw0L/QvtC70L3QuNGC0LUg0L3QvtC80LXRgCDQv9C70LDRgtC10LbQsCDQtNC70Y8g0LLQvtC30LLRgNCw0YLQsCDQlNChXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKG51bSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSZWZ1bmQoTnVtYmVyKG51bSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5vcGVuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25kdWN0b3IuY3JlYXRlRGl2KHsgY2xzOiBcInNlY3Rpb25cIiwgYXR0cjogeyBcImlkXCI6IFwiZmJ1ejc0XCIgfSB9LCAoc2VjdGlvbkVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uRWxcclxuICAgICAgICAgICAgICAgICAgICAuY3JlYXRlRWwoXCJoMVwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi8J+MkEZCVVo3NFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uRWxcclxuICAgICAgICAgICAgICAgICAgICAuY3JlYXRlRGl2KFwiY29tbWFuZHNcIiwgKGNvbW1hbmRCdG5zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRCdG5zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlRWwoXCJidXR0b25cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsczogXCJmYnV6NzQtYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCLQodC+0LfQtNCw0YLRjCDQt9Cw0LzQtdGC0LrRg1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwi0KHQvtC30LTQsNGC0Ywg0LfQsNC80LXRgtC60YNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOb3RlKFwiZmJ1ejc0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25kdWN0b3IuY3JlYXRlRGl2KHsgY2xzOiBcInNlY3Rpb25cIiwgYXR0cjogeyBcImlkXCI6IFwic29mdFwiIH0gfSwgKHNlY3Rpb25FbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VjdGlvbkVsXHJcbiAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUVsKFwiaDFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIvCfkrtTb2Z0XCJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHNlY3Rpb25FbFxyXG4gICAgICAgICAgICAgICAgICAgIC5jcmVhdGVEaXYoXCJjb21tYW5kc1wiLCAoY29tbWFuZEJ0bnMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZEJ0bnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jcmVhdGVFbChcImJ1dHRvblwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzOiBcInNvZnQtYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCLQodC+0LfQtNCw0YLRjCDQt9Cw0LzQtdGC0LrRg1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwi0KHQvtC30LTQsNGC0Ywg0LfQsNC80LXRgtC60YNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVOb3RlKFwic29mdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uZHVjdG9yLmNyZWF0ZURpdih7IGNsczogXCJzZWN0aW9uXCIsIGF0dHI6IHsgXCJpZFwiOiBcIm9yZ1wiIH0gfSwgKHNlY3Rpb25FbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VjdGlvbkVsXHJcbiAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUVsKFwiaDFcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIvCfm6BPcmdhbml6YXRpb25cIlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc2VjdGlvbkVsXHJcbiAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZURpdihcImNvbW1hbmRzXCIsIChjb21tYW5kQnRucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kQnRuc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHM6IFwib3JnLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwi0KHQvtC30LTQsNGC0Ywg0LfQsNC80LXRgtC60YNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcItCh0L7Qt9C00LDRgtGMINC30LDQvNC10YLQutGDXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTm90ZShcIm9yZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaGFzQ3JlYXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBPYnNpZGlhbklPKHRoaXMuYXBwKTtcclxuICAgICAgICBjb25zdCBwYXRoID0gXCJkZWxldGVfbWUubWRcIjtcclxuICAgICAgICBjb25zdCBmaWxlID0gYXBwLmdldEZpbGVCeVBhdGgocGF0aCk7XHJcbiAgICAgICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmlsZSAke3BhdGh9IG5vdCBmb3VuZC5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXBwLmRlbGV0ZShmaWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbnVubG9hZCgpIHtcclxuICAgIH1cclxufVxyXG4iXX0=