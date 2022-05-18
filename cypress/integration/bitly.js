/// <reference types="cypress" />

import { QR, logoPane, setColorsPane } from '../fixtures/locators.json'
import 'cypress-file-upload';

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

    it('should disable createQR button once created', () => {
        cy
            .setUrl("https://google.com")
            .openPane(3)
            .uploadLogo('image.jpeg')
            .get(QR.createQRCode).click()
            .get(QR.createQRCode).should('have.attr', 'disabled')
    })

    it('should disable download button if QR not created', () => {
        cy
            .setUrl("https://google.com")
            .openPane(3)
            .uploadLogo('image.jpeg')
            .get(QR.downloadPng).should('have.attr', 'disabled', 'disabled')
            .get(QR.createQRCode).click()
            .get(QR.downloadPng).should('not.have.attr', 'disabled')
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
        cy.moveSlider(120)
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

    it('should give error for upload file > 2MB', () => {
        cy
            .openPane(3)
            .get(logoPane.uploadLogo).attachFile('bigFile.png')
            .get(logoPane.fileError)
            .should('exist').and('not.have.class', 'ng-hide').and('contain.text', 'File is too big. Max. size is 2 MB.')
            .get(logoPane.logoPlaceholder).should('exist')
            .get(logoPane.removeLogo).should('have.class', 'ng-hide')
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
            .downloadPng().then(() => {
            cy.readFile('cypress/downloads/qr-code.png', { timeout: 10000 })
                .should('exist')
        })
    })

    it('should show info modal for unsubscribed users', () => {
        cy
            // Info Modal for Uploading MP3, PDF or any file
            .get(QR.uploadMediaToQR).click()
            .get(QR.adModal).should('exist')
            // Info Modal for statistics and editability
            .get(QR.statistics).click({force: true})
            .get(QR.statisticsModal).should('exist')
            // Info Modal for Spotlight your logo
            .get(QR.spotlightLogo).click({force: true})
            .get(QR.logoModal).should('exist')
    })
})
