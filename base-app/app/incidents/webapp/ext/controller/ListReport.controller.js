sap.ui.define(['sap/ui/core/mvc/ControllerExtension',
	"sap/ui/fl/write/api/FeaturesAPI"], function (ControllerExtension, FeaturesAPI) {
	'use strict';

	return ControllerExtension.extend('ns.incidents.ext.controller.ListReport', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf ns.incidents.ext.controller.ListReport
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();

				const oAdaptationButton = this.getView().byId("fe::CustomAction::adapt-ui"); // must match the ID of the button
				FeaturesAPI.isKeyUser().then(function (bIsKeyUser) {
					console.log("key user is " + bIsKeyUser);
					oAdaptationButton.setVisible(bIsKeyUser);
				});
			}
		}
	});
});
