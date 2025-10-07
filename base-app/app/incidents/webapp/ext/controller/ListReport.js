sap.ui.define([
    "sap/ui/core/Core","sap/ui/core/Lib"
], function(Core, Lib) {
    'use strict';

    return {
        /**
         * Generated event handler.
         *
         * @param oContext the context of the page on which the even    t was fired. `undefined` for list report page.
         * @param aSelectedContexts the selected contexts of the table rows.
         */
        onAdaptUi: async function(oContext, aSelectedContexts) {
            await Lib.load({name: "sap.ui.rta"});
            sap.ui.require([
                "sap/ui/rta/api/startKeyUserAdaptation"
            ], (startKeyUserAdaptation) => {
                startKeyUserAdaptation({
                    rootControl: Core.byId("container-ns.incidents---appRootView")
                })
            })
        }
    };
});
