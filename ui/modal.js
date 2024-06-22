import { __awaiter } from "tslib";
import { Modal, Setting } from "obsidian";
export class ContractModal extends Modal {
    constructor(app, props, onSubmit) {
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
            .addText((text) => text.onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.s1 = value;
            // this.result.num = Number(value);
        })));
        new Setting(contentEl)
            .setName("Дата договора")
            .addText((text) => text.onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.s2 = value;
            // this.result.date = value
        })));
        new Setting(contentEl)
            .addButton((btn) => btn
            .setButtonText("Submit")
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
export class RefundModal extends Modal {
    constructor(app, props, onSubmit) {
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
            .addText((text) => text.onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.s1 = value;
        })));
        new Setting(contentEl)
            .addButton((btn) => btn
            .setButtonText("Submit")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb2RhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFPLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFRL0MsTUFBTSxPQUFPLGFBQWMsU0FBUSxLQUFLO0lBWXBDLFlBQVksR0FBUSxFQUFFLEtBQXlCLEVBQUUsUUFBMEM7UUFDdkYsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBTTtRQUNGLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFekIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDL0MsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFFN0MsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDO2FBQ2pCLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzthQUN6QixPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBTyxLQUFLLEVBQUUsRUFBRTtZQUM3QyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztZQUNoQixtQ0FBbUM7UUFDdkMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO1FBRVIsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDO2FBQ2pCLE9BQU8sQ0FBQyxlQUFlLENBQUM7YUFDeEIsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQU8sS0FBSyxFQUFFLEVBQUU7WUFDN0MsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7WUFDaEIsMkJBQTJCO1FBQy9CLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQUVSLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNqQixTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUNmLEdBQUc7YUFDRSxhQUFhLENBQUMsUUFBUSxDQUFDO2FBQ3ZCLE1BQU0sRUFBRTthQUNSLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELE9BQU87UUFDSCxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN0QixDQUFDO0NBQ0o7QUFRRCxNQUFNLE9BQU8sV0FBWSxTQUFRLEtBQUs7SUFNbEMsWUFBWSxHQUFRLEVBQUUsS0FBdUIsRUFBRSxRQUE4QjtRQUN6RSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxNQUFNO1FBQ0YsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUV6QixTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMvQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUU3QyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUM7YUFDakIsT0FBTyxDQUFDLDRCQUE0QixDQUFDO2FBQ3JDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFPLEtBQUssRUFBRSxFQUFFO1lBQzdDLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQUVSLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNqQixTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUNmLEdBQUc7YUFDRSxhQUFhLENBQUMsUUFBUSxDQUFDO2FBQ3ZCLE1BQU0sRUFBRTthQUNSLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxPQUFPO1FBQ0gsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUN6QixTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBNb2RhbCwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5leHBvcnQgaW50ZXJmYWNlIENvbnRyYWN0TW9kYWxQcm9wcyB7XHJcbiAgICB0aXRsZTogc3RyaW5nO1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udHJhY3RNb2RhbCBleHRlbmRzIE1vZGFsIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbiAgICBzMTogc3RyaW5nO1xyXG4gICAgczI6IHN0cmluZztcclxuICAgIHJlc3VsdDoge1xyXG4gICAgICAgIG51bTogbnVtYmVyLFxyXG4gICAgICAgIGRhdGU6IHN0cmluZyxcclxuICAgIH07XHJcbiAgICAvLyBvblN1Ym1pdDogKCkgPT4geyBudW06IG51bWJlciwgZGF0ZTogc3RyaW5nIH07XHJcbiAgICBvblN1Ym1pdDogKHMxOiBzdHJpbmcsIHMyOiBzdHJpbmcpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByb3BzOiBDb250cmFjdE1vZGFsUHJvcHMsIG9uU3VibWl0OiAoczE6IHN0cmluZywgczI6IHN0cmluZykgPT4gdm9pZCkge1xyXG4gICAgICAgIHN1cGVyKGFwcCk7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IHByb3BzLnRpdGxlO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHByb3BzLnRleHQ7XHJcbiAgICAgICAgdGhpcy5vblN1Ym1pdCA9IG9uU3VibWl0O1xyXG4gICAgfVxyXG5cclxuICAgIG9uT3BlbigpIHtcclxuICAgICAgICBsZXQgeyBjb250ZW50RWwgfSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogdGhpcy50aXRsZSB9KTtcclxuICAgICAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJwXCIsIHsgdGV4dDogdGhpcy50ZXh0IH0pO1xyXG5cclxuICAgICAgICBuZXcgU2V0dGluZyhjb250ZW50RWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKFwi0J3QvtC80LXRgCDQtNC+0LPQvtCy0L7RgNCwXCIpXHJcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB0ZXh0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zMSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5yZXN1bHQubnVtID0gTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBuZXcgU2V0dGluZyhjb250ZW50RWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKFwi0JTQsNGC0LAg0LTQvtCz0L7QstC+0YDQsFwiKVxyXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT4gdGV4dC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuczIgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMucmVzdWx0LmRhdGUgPSB2YWx1ZVxyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRlbnRFbClcclxuICAgICAgICAgICAgLmFkZEJ1dHRvbigoYnRuKSA9PlxyXG4gICAgICAgICAgICAgICAgYnRuXHJcbiAgICAgICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoXCJTdWJtaXRcIilcclxuICAgICAgICAgICAgICAgICAgICAuc2V0Q3RhKClcclxuICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN1Ym1pdCh0aGlzLnMxLCB0aGlzLnMyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25DbG9zZSgpIHtcclxuICAgICAgICBsZXQgeyBjb250ZW50RWwgfSA9IHRoaXM7XHJcbiAgICAgICAgY29udGVudEVsLmVtcHR5KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuZXhwb3J0IGludGVyZmFjZSBSZWZ1bmRNb2RhbFByb3BzIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWZ1bmRNb2RhbCBleHRlbmRzIE1vZGFsIHtcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbiAgICBzMTogc3RyaW5nO1xyXG4gICAgb25TdWJtaXQ6IChzMTogc3RyaW5nKSA9PiB2b2lkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcm9wczogUmVmdW5kTW9kYWxQcm9wcywgb25TdWJtaXQ6IChzMTogc3RyaW5nKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwKTtcclxuICAgICAgICB0aGlzLnRpdGxlID0gcHJvcHMudGl0bGU7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gcHJvcHMudGV4dDtcclxuICAgICAgICB0aGlzLm9uU3VibWl0ID0gb25TdWJtaXQ7XHJcbiAgICB9XHJcblxyXG4gICAgb25PcGVuKCkge1xyXG4gICAgICAgIGxldCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcclxuXHJcbiAgICAgICAgY29udGVudEVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiB0aGlzLnRpdGxlIH0pO1xyXG4gICAgICAgIGNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyB0ZXh0OiB0aGlzLnRleHQgfSk7XHJcblxyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRlbnRFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoXCLQndC+0LzQtdGAINC/0LvQsNGC0LXQttCwINC00LvRjyDQstC+0LfQstGA0LDRgtCwXCIpXHJcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB0ZXh0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zMSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRlbnRFbClcclxuICAgICAgICAgICAgLmFkZEJ1dHRvbigoYnRuKSA9PlxyXG4gICAgICAgICAgICAgICAgYnRuXHJcbiAgICAgICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoXCJTdWJtaXRcIilcclxuICAgICAgICAgICAgICAgICAgICAuc2V0Q3RhKClcclxuICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN1Ym1pdCh0aGlzLnMxKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25DbG9zZSgpIHtcclxuICAgICAgICBsZXQgeyBjb250ZW50RWwgfSA9IHRoaXM7XHJcbiAgICAgICAgY29udGVudEVsLmVtcHR5KCk7XHJcbiAgICB9XHJcbn1cclxuIl19