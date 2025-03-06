
define(
	'MHI.MHIShippingCharge.Checkout'
,   [
		//'MHI.MHIShippingCharge.Checkout.View'
		'OrderWizard.Module.Shipmethod'
	,	'OrderWizard.Module.ShowShipments'
    ,	'LiveOrder.Model'
	,	'MHIShippingCharge.Checkout'
	,	'SC.Configuration'
	,	'Utils'
	,	'jQuery'
	,	'underscore'
	]
,   function (
		//CheckoutView
		OrderWizardModuleShipmethod
	,	OrderWizardModuleShowShipments
	,   LiveOrderModel
	,	MHIShippingChargeCheckout
	,	Configuration
	,	Utils
	,	jQuery
	,	_
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			OrderWizardModuleShipmethod.prototype.initialize = _.wrap( OrderWizardModuleShipmethod.prototype.initialize, function(fn) {
				fn.apply(this, _.toArray(arguments).slice(1));
				var self = this;

				// GROUND SHIPPING 15%
				var SHIPPING_METHOD = Configuration.get('MHIShippingCharge.shippingID');

				var TOTAL_SHIPPING = 0;
				var SHIPPING_PERCENTAGE = 0.15;
				var IS_SHIPPABLE = false;
				var MINIMUM_SHIPPING = 9.95;
				var cart = container.getComponent('Cart');
				
				cart.getLines().then(function(lines) {
					
					var arrPromises = [];
					
					_.each( lines, function( ln ) {
						var isItemShippable = false;
						if ( ln.item.itemtype == 'InvtPart' ) {
							isItemShippable = true;
						} else if ( ln.item.itemtype == 'Kit' ) {
							var shippingModel = new MHIShippingChargeCheckout();
							arrPromises.push(shippingModel.fetch({
								data: {
									item_id: ln.item.internalid,
									action: 'is_kit_shippable',
									rate: ln.amount
								}
							}))
						}

						if ( isItemShippable ) {
						 	var rate = ln.amount;
						 	var itemShipping = rate * SHIPPING_PERCENTAGE;
						 	TOTAL_SHIPPING += itemShipping;
						 	IS_SHIPPABLE = true;
						}
					})


					if ( arrPromises.length != 0 ) {
						Promise.all(arrPromises).then(function (values) {
							_.each(values, function(val) {
								var isItemShippable = val.is_shippable;
								if ( isItemShippable ) {
									var rate = val.rate;
									var itemShipping = rate * SHIPPING_PERCENTAGE;
									TOTAL_SHIPPING += itemShipping;
									IS_SHIPPABLE = true;
					
									//if ( IS_SHIPPABLE && TOTAL_SHIPPING < MINIMUM_SHIPPING ) {
									//	TOTAL_SHIPPING = MINIMUM_SHIPPING
									//}

									self.totalShipping = TOTAL_SHIPPING.toFixed(2);
								}
							});
							
							if ( IS_SHIPPABLE && TOTAL_SHIPPING < MINIMUM_SHIPPING ) {
								self.totalShipping = MINIMUM_SHIPPING
							}
							self.render();
						});
					}

					if ( IS_SHIPPABLE && TOTAL_SHIPPING < MINIMUM_SHIPPING ) {
						TOTAL_SHIPPING = MINIMUM_SHIPPING
					}

					self.totalShipping = TOTAL_SHIPPING.toFixed(2);
					self.render();
				});
			});

			OrderWizardModuleShipmethod.prototype.getContext = _.wrap( OrderWizardModuleShipmethod.prototype.getContext, function(fn){
				var context = fn.apply(this, _.toArray(arguments).slice(1));	
      			var self = this;
				
				// GROUND SHIPPING 15%
				var SHIPPING_METHOD = Configuration.get('MHIShippingCharge.shippingID');

				_.each( context.shippingMethods, function(shipping) {
					if ( shipping.internalid == SHIPPING_METHOD ) {
						shipping.rate_formatted = Utils.formatCurrency( self.totalShipping );
					}
				});

				return context;
			})

			OrderWizardModuleShowShipments.prototype.initialize = _.wrap( OrderWizardModuleShowShipments.prototype.initialize, function(fn){
				fn.apply(this, _.toArray(arguments).slice(1));
				var self = this;

				// GROUND SHIPPING 15%
				var SHIPPING_METHOD = Configuration.get('MHIShippingCharge.shippingID');

				var TOTAL_SHIPPING = 0;
				var SHIPPING_PERCENTAGE = 0.15;
				var IS_SHIPPABLE = false;
				var MINIMUM_SHIPPING = 9.95;
				var cart = container.getComponent('Cart');
				
				cart.getLines().then(function(lines) {
					
					var arrPromises = [];

					_.each( lines, function( ln ) {
						var isItemShippable = false;
						if ( ln.item.itemtype == 'InvtPart' ) {
							isItemShippable = true;
						} else if ( ln.item.itemtype == 'Kit' ) {
							var shippingModel = new MHIShippingChargeCheckout();
							arrPromises.push(shippingModel.fetch({
								data: {
									item_id: ln.item.internalid,
									action: 'is_kit_shippable',
									rate: ln.amount
								}
							}))
						}
						
						if ( isItemShippable ) {
							var rate = ln.amount;
							var itemShipping = rate * SHIPPING_PERCENTAGE;
							TOTAL_SHIPPING += itemShipping;
							IS_SHIPPABLE = true;
						}
					});

					if ( arrPromises.length != 0 ) {
						Promise.all(arrPromises).then(function (values) {
							_.each(values, function(val) {
								var isItemShippable = val.is_shippable;
								if ( isItemShippable ) {
									var rate = val.rate;
									var itemShipping = rate * SHIPPING_PERCENTAGE;
									TOTAL_SHIPPING += itemShipping;
									IS_SHIPPABLE = true;
					
									//if ( IS_SHIPPABLE && TOTAL_SHIPPING < MINIMUM_SHIPPING ) {
									//	TOTAL_SHIPPING = MINIMUM_SHIPPING
									//}

									self.totalShipping = TOTAL_SHIPPING.toFixed(2);
								}
							});

							if ( IS_SHIPPABLE && TOTAL_SHIPPING < MINIMUM_SHIPPING ) {
								self.totalShipping = MINIMUM_SHIPPING
							}

							self.setShipping( self.totalShipping || 0, SHIPPING_METHOD );
							self.render();
						});
					}
					
					if ( IS_SHIPPABLE && TOTAL_SHIPPING < MINIMUM_SHIPPING ) {
						TOTAL_SHIPPING = MINIMUM_SHIPPING
					}
					
					self.setShipping( TOTAL_SHIPPING, SHIPPING_METHOD );
					self.render();
				});
			});

			OrderWizardModuleShowShipments.prototype.setShipping = function(TOTAL_SHIPPING, SHIPPING_METHOD) {
				var self = this;
				var liveorder = LiveOrderModel.getInstance();
				self.shipping_methods = liveorder.get('shipmethods').models;

				_.each( self.shipping_methods, function(shipping) {
					if ( shipping.get('internalid') == SHIPPING_METHOD ) {
						shipping.set('rate_formatted', Utils.formatCurrency( TOTAL_SHIPPING ) );
					}
				});
			};

			OrderWizardModuleShowShipments.prototype.getContext = _.wrap( OrderWizardModuleShowShipments.prototype.getContext, function(fn){
				var context = fn.apply(this, _.toArray(arguments).slice(1));	
				var self = this;

				context.shippingMethods = self.shipping_methods;
				return context;
			})

		}
	};
});
