/// <reference types="cypress" />

import { QR, logoPane, setColorsPane } from '../fixtures/locators.json'
import chaiColors from 'chai-colors'
chai.use(chaiColors);

describe('Test QR Code Monkey Website', () => {

    beforeEach(() => {
        cy.visit('')
    })

    it('should generate QR Code successfully', () => {
        cy.intercept(Cypress.config('apiBaseUrl') + '/qr/custom').as('createQR')

        cy
            .setUrl("https://google.com")
            .openPane(3)
            .uploadLogo('image.jpeg')
            .get(QR.createQRCode).click()
            .wait('@createQR').then((res) => {
                expect(res.response.statusCode).eq(200)
            })
    })

    it('should have default QR code and generate correct QR code', () => {
        cy.get(QR.QRPreview).readCode() // Read Default QR
            .should('have.property', 'text', 'https://qrstud.io/qrmnky')

        cy.setUrl("https://google.com")
            .get(QR.createQRCode).click().then(() => {
                // should not contain default QR anymore
                cy.get(QR.QRPreview).invoke('attr', 'ng-src').should('not.contain', '/img/default-preview-qr.svg')
                // read new QR, it should contain the new set URL
                cy.get(QR.QRPreview).readCode()
                    .should('have.property', 'text', 'https://google.com')
            })
    })

    it('should be able to select quality through slider', () => {
        cy.get(QR.slider)
            .trigger('mousedown', { which: 1 }, { force: true })
            .trigger('mousemove', 120, 0, { force: true })
            .trigger('mouseup')
            .get(QR.sliderValue).should('contain.text', '1800 x 1800 Px');
    })

    it('should have only first pane opened by default', () => {
        cy.get(QR.activePane).should('have.length', 1).within(() => {
            cy.get(QR.collpaseButton).should('exist')
                .get(QR.title).should('have.text', 'Enter Content')
        })
    })

    it('should collapse pane if other expands', () => {
        cy.openPane(2)
            .should('have.class', 'active')
            .get(QR.enterContentPane).should('not.have.class', 'active')
    })

    it('should upload and remove logo', () => {
        // Remove logo should be hidden by default
        cy.openPane(3)
            .get(logoPane.logoPlaceholder).should('exist')
            .get(logoPane.removeLogo).should('have.class', 'ng-hide')

        // After uploading logo, remove logo should appear    
        cy.get(logoPane.uploadLogo).attachFile('image.jpeg')
            .get(logoPane.logoPreview).should('exist')
            .get(logoPane.removeLogo).should('exist')

        // After removing logo, remove button dissapears and placeholder appears
        cy.get(logoPane.removeLogo).click({ force: true })
            .get(logoPane.logoPlaceholder).should('exist')
            .get(logoPane.removeLogo).should('have.class', 'ng-hide')
            .get(logoPane.logoPlaceholder).should('exist')
    })

    it('should be able to swap colors gradients', () => {
        cy.openPane(2)
            .get(setColorsPane.colorGradientRadio).click()
            .setFirstColor('#D21919').setSecondColor('#0277BD')
            .get(setColorsPane.swapColorGradient).click()
            .get(setColorsPane.firstColor).should('have.value', '#0277BD')
            .get(setColorsPane.secondColor).should('have.value', '#D21919')
    })

    it('should be able to download QR code', () => {
        cy.openPane(2)
            .get(setColorsPane.colorGradientRadio).click()
            .setFirstColor('#D21919').setSecondColor('#0277BD')
            .get(logoPane.uploadLogo).attachFile('image.jpeg')
            .get(QR.createQRCode).click()

            // Below hack is due to cypress bug - Issue #14857
        cy.window().document().then(function (doc) {
            doc.addEventListener('click', () => {
                setTimeout(function () { doc.location.reload() }, 5000)
            })
            cy.get(QR.downloadPng).click()
        }).then(() => {
            cy.readFile('cypress/downloads/qr-code.png', { timeout: 10000 })
                .should('exist')
        })
    })
})