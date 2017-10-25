"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_1 = require("./components/accounts");
const assets_1 = require("./components/assets");
const servers_1 = require("./components/servers");
const calculator_1 = require("./components/calculator");
const activator_1 = require("./components/activator");
const { shell } = require('electron');
servers_1.serversComponents.init().then(() => {
    $('#beforeApp').fadeOut(() => { $('#app').fadeIn(); });
    setInterval(() => {
        servers_1.serversComponents.getBlockInfo().catch(e => { console.log(e); });
    }, 10000);
    accounts_1.accountsComponent.init();
    assets_1.assetsComponents.init();
    calculator_1.calculatorComponent.init();
    activator_1.activatorComponent.init();
}).catch(e => {
    console.log(e);
});
$('#nationLink').on('click', e => {
    e.preventDefault();
    shell.openExternal($(e.target).attr('href'));
});
$('.modal').modal();
$('select').material_select();
