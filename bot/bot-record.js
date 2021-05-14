const puppeteer = require('puppeteer');

module.exports = class BotRecord {
    async setRoomid(room_id) {
        return this.roomId = room_id;
    }
    async openUrl() {
        var url = "http://localhost:3000/bot/?room_id=" + this.roomId;
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        await this.page.goto(url);
    }
    async closeBrower() {
        this.page.on('dialog', async dialog => {
            if (dialog.message() === "send data success") {
                await this.browser.close()
            }
        });
    }
}