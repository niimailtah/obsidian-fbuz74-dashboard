import { App, Modal, Setting } from "obsidian";

// ====================================================================================================
export interface ContractModalProps {
    title: string;
    text: string;
}

export class ContractModal extends Modal {
    title: string;
    text: string;
    s1: string;
    s2: string;
    result: {
        num: number,
        date: string,
    };
    // onSubmit: () => { num: number, date: string };
    onSubmit: (s1: string, s2: string) => void;

    constructor(app: App, props: ContractModalProps, onSubmit: (s1: string, s2: string) => void) {
        super(app);
        this.title = props.title;
        this.text = props.text;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        let { contentEl } = this;

        contentEl.createEl("h2", { text: this.title });
        contentEl.createEl("p", { text: this.text });

        new Setting(contentEl)
            .setName("Номер договора")
            .addText((text) => text.onChange(async (value) => {
                this.s1 = value;
                // this.result.num = Number(value);
            }));

        new Setting(contentEl)
            .setName("Дата договора")
            .addText((text) => text.onChange(async (value) => {
                this.s2 = value;
                // this.result.date = value
            }));

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Добавить договор")
                    .setCta()
                    .onClick(() => {
                        this.close();
                        this.onSubmit(this.s1, this.s2);
                    }));
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}

// ====================================================================================================
export interface RefundModalProps {
    title: string;
    text: string;
}

export class RefundModal extends Modal {
    title: string;
    text: string;
    s1: string;
    onSubmit: (s1: string) => void;

    constructor(app: App, props: RefundModalProps, onSubmit: (s1: string) => void) {
        super(app);
        this.title = props.title;
        this.text = props.text;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        let { contentEl } = this;

        contentEl.createEl("h2", { text: this.title });
        contentEl.createEl("p", { text: this.text });

        new Setting(contentEl)
            .setName("Номер платежа для возврата")
            .addText((text) => text.onChange(async (value) => {
                this.s1 = value;
            }));

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Добавить возврат")
                    .setCta()
                    .onClick(() => {
                        this.close();
                        this.onSubmit(this.s1);
                    }));
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}
