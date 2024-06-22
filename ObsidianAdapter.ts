import {
    App,
    CachedMetadata,
    EventRef,
    FileManager,
    MetadataCache,
    TAbstractFile,
    TFile,
    Vault,
} from "obsidian";

/**
 * A stripped-down interface into the Obsidian API that only exposes the necessary
 * functions that calendars will use. Factoring this out is useful for mocking the
 * Obsidian API in unit tests.
 */
export interface ObsidianInterface {
    /**
     * @param path path to get the file for.
     * Get a file/folder from the Vault. Returns null if file doesn't exist.
     */
    getAbstractFileByPath(path: string): TAbstractFile | null;

    /**
     * @param path path to get the file for.
     * Get a file from the Vault. Returns null if file doesn't exist or is a folder.
     */
    getFileByPath(path: string): TFile | null;

    /**
     * Create a new file at the given path with the given contents.
     *
     * @param path path to create the file at.
     * @param contents new contents of the file.
     */
    create(path: string, contents: string): Promise<TFile>;

    /**
     * Delete a file.
     * @param file file to delete
     * @param system set to true to send to system trash, otherwise Vault trash.
     */
    delete(file: TFile): Promise<void>;

    /**
     * @param file file to read.
     * Read a file from the vault.
     */
    read(file: TFile): Promise<string>;
}

/**
 * "Production" implementation of the ObsidianInterface.
 * It takes in the Vault and MetadataCache from Plugin.app.
 */
export class ObsidianIO implements ObsidianInterface {
    vault: Vault;
    systemTrash: boolean;

    constructor(app: App, systemTrash: boolean = true) {
        this.vault = app.vault;
        this.systemTrash = systemTrash;
    }

    getAbstractFileByPath(path: string): TAbstractFile | null {
        return this.vault.getAbstractFileByPath(path);
    }

    getFileByPath(path: string): TFile | null {
        const f = this.vault.getAbstractFileByPath(path);
        if (!f) {
            return null;
        }
        if (!(f instanceof TFile)) {
            return null;
        }
        return f;
    }

    create(path: string, contents: string): Promise<TFile> {
        return this.vault.create(path, contents);
    }

    delete(file: TFile): Promise<void> {
        return this.vault.trash(file, this.systemTrash);
    }

    read(file: TFile): Promise<string> {
        return this.vault.cachedRead(file);
    }
}
