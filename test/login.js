const { describe, afterEach, before } = require('mocha');
const { Builder, By, Key, until, logging, Capabilities } = require('selenium-webdriver');
require('dotenv').config({ path: '.env.development' });
const assert = require('assert');
const { expect } = require("chai");
const { BROWSERS } = require('../commons/constants/browser');
const LOGIN_URL = process.env.LOGIN_URL;

let user = {
    email: 'shivu@master.id',
    password: 'Terseraaah'
};
let appHost = LOGIN_URL;
let driver;

describe("Login", () => {

    afterEach(async () => {
        await driver.sleep(3000);
        await driver.quit();
    })
    
    BROWSERS.forEach(browser => {
        
        it(`Login to dashboard from browser ${browser}`, async () => {
                
            driver = new Builder()
                .forBrowser(browser)
                .build();

            await driver.get(appHost);

            // login to the application
            await driver.findElement(By.xpath(`/html/body/div/div/div/div/div/div/div/div/div/div[2]/form/div[1]/div/input`)).sendKeys(user.email, Key.RETURN);
            await driver.findElement(By.xpath(`/html/body/div/div/div/div/div/div/div/div/div/div[2]/form/div[2]/div/input`)).sendKeys(user.password, Key.RETURN);
            await driver.wait(until.elementsLocated(By.css(`h1.text-welcome`)));

            let textStatus = await driver.executeScript(`return document.querySelectorAll('h1.text-welcome').length`);

            // Jalankan skrip JavaScript untuk mengumpulkan data jaringan
            const networkData = await driver.executeScript(`
                const performanceEntries = performance.getEntriesByType('resource');
                const requests = performanceEntries.map(entry => {
                    return {
                        entry,
                        url: entry.name,
                        method: entry.initiatorType,
                        type: entry.entryType,
                    };
                });
                
                return requests;
            `);

            // Tampilkan data jaringan
            let correctUrl = networkData.find(data => data.url.includes("v1/user/me"));
            let userData = await driver.executeScript("return window.localStorage.getItem('user')")
            userData = JSON.parse(userData);
            
            assert.strictEqual(textStatus > 1, textStatus > 1); 
            expect(correctUrl.url).to.includes("v1/user/me");
            expect(userData.id).to.greaterThan(0);
            
        });
        
        it(`Failed login (wrong email) from browser ${browser}`, async () => {
            
            driver = new Builder()
                .forBrowser(browser)
                .build();

            // navigate to the application
            await driver.get(appHost);

            // login to the application
            await driver.findElement(By.xpath(`/html/body/div/div/div/div/div/div/div/div/div/div[2]/form/div[1]/div/input`)).sendKeys(user.email + 'a', Key.RETURN);
            await driver.findElement(By.xpath(`/html/body/div/div/div/div/div/div/div/div/div/div[2]/form/div[2]/div/input`)).sendKeys(user.password, Key.RETURN);
            await driver.wait(until.elementsLocated(By.xpath(`/html/body/div/div/div/div/div/div/div/div/div/div[2]`)));

            let typeStatus = await driver.executeScript(`return document.querySelector('.alert.alert-warning').innerText`),
            textStatus = await driver.executeScript(`return document.querySelectorAll('.alert.alert-warning').length`);

            assert.strictEqual(typeStatus.includes("email"), true); 
            assert.strictEqual(textStatus > 1, typeStatus > 1); 
            
        });

        it(`failed login (wrong password) from browser ${browser}`, async function () {
            
            driver = new Builder()
                .forBrowser(browser)
                .build();

            // navigate to the application
            await driver.get(appHost);

            // login to the application
            await driver.findElement(By.xpath(`/html/body/div/div/div/div/div/div/div/div/div/div[2]/form/div[1]/div/input`)).sendKeys(user.email, Key.RETURN);
            await driver.findElement(By.xpath(`/html/body/div/div/div/div/div/div/div/div/div/div[2]/form/div[2]/div/input`)).sendKeys(user.password[0], Key.RETURN);
            await driver.wait(until.elementsLocated(By.xpath(`/html/body/div/div/div/div/div/div/div/div/div/div[2]/div[1]`)));

            let typeStatus = await driver.executeScript(`return document.querySelector('.alert.alert-warning').innerText`),
            textStatus = await driver.executeScript(`return document.querySelectorAll('.alert.alert-warning').length`);

            assert.strictEqual(typeStatus.includes("password"), true); 
            assert.strictEqual(textStatus > 1, typeStatus > 1); 
    
        })

    })
    


});