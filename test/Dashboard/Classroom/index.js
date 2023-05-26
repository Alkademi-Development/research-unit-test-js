import { describe, afterEach, before } from 'mocha';
import { Builder, By, Key, until, logging, Capabilities } from 'selenium-webdriver';
import assert from 'assert';
import { expect } from "chai";
import yargs from 'yargs'
import { BROWSERS } from '#root/commons/constants/browser';
import { getUserAccount } from '#root/commons/utils/userUtils';
import { goToApp } from '#root/commons/utils/appUtils';

const LOGIN_URL = process.env.LOGIN_URL;
const BASE_URL = process.env.BASE_URL;
/**
 * Get the user data for authentication
 */

const user = getUserAccount(yargs(process.argv.slice(2)).parse());

let appHost = LOGIN_URL;
let driver;

describe("Classroom", () => {

    afterEach(async () => {
        await driver.sleep(3000);
        await driver.quit();
    })
    
    BROWSERS.forEach(browser => {
        
        it(`Check for class card ${browser}`, async () => {
                
            // Go to application
            driver = await goToApp(browser, appHost)

            await driver.manage().window().maximize();
            await driver.get(appHost);

            // login to the application
            await driver.findElement(By.xpath(`/html/body/div/div/div/div/div/div/div/div/div/div[2]/form/div[1]/div/input`)).sendKeys(user.email, Key.RETURN);
            await driver.findElement(By.xpath(`/html/body/div/div/div/div/div/div/div/div/div/div[2]/form/div[2]/div/input`)).sendKeys(user.password, Key.RETURN);
            await driver.wait(until.elementsLocated(By.css(`h1.text-welcome`)), 5000);

            let textStatus = await driver.executeScript(`return document.querySelectorAll('h1.text-welcome').length`);
            let doughnutChart = await driver.findElement(By.id('doughnut-chart')).isDisplayed();

            await driver.findElement(By.css('a i.ri-icon.ri-stack-fill')).click()

            await driver.wait(until.elementsLocated(By.css(`div.card-class`)), 5000);

            let classCard = await driver.findElement(By.css('div.card-class')).isDisplayed();

            // Tampilkan data jaringan
            let userData = await driver.executeScript("return window.localStorage.getItem('user')")
            userData = JSON.parse(userData);
            
            assert.strictEqual(textStatus > 1, textStatus > 1); 
            expect(userData.id).to.greaterThan(0);
            expect(doughnutChart).to.equal(true);
            expect(classCard).to.equal(true);
            
        });

    })
    


});