import { describe, afterEach, before } from 'mocha';
import { Builder, By, Key, until, logging, Capabilities } from 'selenium-webdriver';
import addContext from 'mochawesome/addContext.js';
import assert from 'assert';
import { expect } from "chai";
import yargs from 'yargs';
import fs from 'fs';
import path from 'path';
import { BROWSERS } from '#root/commons/constants/browser';
import { goToApp } from '#root/commons/utils/appUtils';
import { appHost } from '#root/api/app-token';
import { takeScreenshot } from '#root/commons/utils/fileUtils';
import { fileURLToPath } from 'url';
import { captureConsoleErrors, parseToDomain } from '#root/commons/utils/generalUtils';
import { thrownAnError } from '#root/commons/utils/generalUtils';
import moment from 'moment-timezone';

let driver;
let errorMessages;
let screenshootFilePath = fileURLToPath(import.meta.url);
if (process.platform === 'win32') {
    screenshootFilePath = path.resolve(`./screenshoot/test/${screenshootFilePath.replaceAll("\\", "\\").split("\\test\\")[1].replaceAll(".js", "")}`);
} else {
    screenshootFilePath = path.resolve(`./screenshoot/test/${screenshootFilePath.split("/test/")[1].replaceAll(".js", "")}`);
}

describe("Test", () => {
    let customMessages = [];

    after(async function () {
        console.log(`${' '.repeat(4)}Screenshoots test berhasil di buat, berada di folder: ${screenshootFilePath} `);
    });

    afterEach(async function () {
        fs.mkdir(screenshootFilePath, { recursive: true }, (error) => {
            if (error) {
                console.error(`Terjadi kesalahan dalam membuat folder screenshoot:`, error);
            }
        });
        let fileNamePath = path.resolve(`${screenshootFilePath}/${this.currentTest?.state != 'failed' ? (this.test?.parent.tests.findIndex(test => test.title === this.currentTest.title)) + 1 + '-[passed]-' + moment().tz("Asia/Jakarta").format("YYYY-MM-DD_HH-mm-ss") : (this.test?.parent.tests.findIndex(test => test.title === this.currentTest.title)) + 1 + '-[failed]-' + moment().tz("Asia/Jakarta").format("YYYY-MM-DD_HH-mm-ss") }.png`);
        await takeScreenshot(driver, fileNamePath);
        if(this.currentTest.isPassed) {
            addContext(this, {
                title: 'Expected Results',
                value: customMessages?.length > 0 ? "- " + customMessages.map(msg => msg.trim()).join("\n- ") : 'No Results'
            })
        } 
        addContext(this, {
            title: 'Screenshoot-Test-Results',
            value: "..\\" + path.relative(fileURLToPath(import.meta.url), fileNamePath)
        });
        await driver.sleep(3000);
        await driver.quit();
    })

    BROWSERS.forEach(browser => {

        it(`Go to app or landing page - from browser ${browser}`, async () => {

            try {

                driver = await goToApp(browser, parseToDomain(appHost));
    
                await driver.manage().window().maximize();
                
                // Tunggu hingga semua permintaan dari server selesai
                driver.wait(async function() {
                    const networkConditions = await driver.executeScript('return performance.getEntriesByType("resource")');
                    const pendingRequests = networkConditions.filter(condition => condition.responseEnd === 0);
                    return pendingRequests.length === 0;
                });
                
                await driver.wait(until.elementsLocated(By.id('home')), 5000);
    
                const home = await driver.findElement(By.css('#home')).isDisplayed();
    
                customMessages = [
                    home ? 'Show the landing page ✅' : 'Show the landing page ❌'
                ];
                expect(home).to.eq(true);

            } catch (error) {
                expect.fail(error);
            }


        });

    })



});