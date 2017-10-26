import {accountsComponent} from "./components/accounts";
import {assetsComponents} from "./components/assets";
import {serversComponents} from "./components/servers";
import {calculatorComponent} from "./components/calculator";
import {activatorComponent} from "./components/activator";
import {database} from "./helpers/database";
const { shell } = require('electron');

declare const $;

database;

serversComponents.init().then(() => {
    $('#beforeApp').fadeOut(() => { $('#app').fadeIn() });

    setInterval(() => {
        serversComponents.getBlockInfo().catch(e => { console.log(e) });
    }, 10000);

    accountsComponent.init();
    assetsComponents.init();
    calculatorComponent.init();
    activatorComponent.init();

}).catch(e => {
    console.log(e);
});

$('#nationLink').on('click', e => {
    e.preventDefault();

    shell.openExternal($(e.target).attr('href'));
});

$('.modal').modal();
$('select').material_select();