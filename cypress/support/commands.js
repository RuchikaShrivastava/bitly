// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload';
import {QR, enterContentPane, logoPane, setColorsPane} from '../fixtures/locators.json'
import 'cypress-iframe';
import { BrowserMultiFormatReader } from '@zxing/browser';
const reader = new BrowserMultiFormatReader();

Cypress.Commands.add('openPane', (index) => {
    var paneLocator = '.pane:nth-child(%s)'.replace('%s', index)
    cy.get(paneLocator).click()
})

Cypress.Commands.add('setUrl', (url) => {
    cy.get(enterContentPane.urlTextBox).clear().type(url)
})

Cypress.Commands.add('uploadLogo', (file) => {
    cy.get(logoPane.uploadLogo).attachFile(file)
})

Cypress.Commands.add('downloadPng', () => {
    // Below hack is due to cypress bug - Issue #14857
    cy.window().document().then(function (doc) {
        doc.addEventListener('click', () => {
            setTimeout(function () { doc.location.reload() }, 5000)
        })
        cy.get(QR.downloadPng).click()
    })
})

Cypress.Commands.add('readCode', { prevSubject: true }, (subject) => {
    const img = subject[0];
    const image = new Image();
    image.width = img.width;
    image.height = img.height;
    image.src = img.src;
    image.crossOrigin = 'Anonymous';
    return reader.decodeFromImageElement(image);
  });

Cypress.Commands.add('setFirstColor', (color) => {
    cy.get(setColorsPane.firstColor).clear().type(color)
})

Cypress.Commands.add('setSecondColor', (color) => {
    cy.get(setColorsPane.secondColor).clear().type(color)
})

Cypress.Commands.add('moveSlider', (value) => {
    cy.get(QR.slider)
        .trigger('mousedown', { which: 1 }, { force: true })
        .trigger('mousemove', value, 0, { force: true })
        .trigger('mouseup')
})