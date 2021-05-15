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
    setRecordTime() {
        this.recordTime = 0;
        var _this = this;
        this.interVTime = setInterval(function() {
            _this.recordTime++;
        }, 1000)
    }
    getRecordTime() {
        return this.recordTime;
    }
    async closeBrower() {
        clearInterval(this.interVTime);
        this.interVTime = 0;
        this.page.on('dialog', async dialog => {
            if (dialog.message() === "send data success") {
                await this.browser.close()
            }
        });
    }
}