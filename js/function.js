var jQuery_3_1_1 = jQuery_3_1_1 || $.noConflict();
(function ($, window, undefined) {
	
	var document = window.document,
		validate = ($.fn.validate !== undefined);
	
	var convert = function() {
	    return {
	        kmToMiles: function(km) { return km / 1.609344; },
	        milesToKm: function(miles) { return miles * 1.609344; },
	        litresToGallons: function(litres) { return litres / 3.78541178; },
	        gallonsToLitres: function(gallons) { return gallons * 3.78541178; },
	        mpgToLPer100km: function(mpg) { return 100 * this.gallonsToLitres(1 / this.milesToKm(mpg)); },
	        lPer100kmToMpg: function(lphk) { return  this.kmToMiles(1 / this.litresToGallons(lphk / 100)); }
	    };
	}();
	
	var format = function() {
	    return {
	        formatCurrency: function(value) {
	            
	            var num = value.toString().replace(/\$|\,/g,'');

	            if(isNaN(num)) {
	                num = "0";
	            }

	            sign = (num == (num = Math.abs(num)));
	            num = Math.floor(num*100+0.50000000001);
	            cents = num%100;
	            num = Math.floor(num/100).toString();
	            if (cents < 10) {
	                cents = "0" + cents;
	            }
	            for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
	                num = num.substring(0,num.length-(4*i+3))+','+
	                    num.substring(num.length-(4*i+3));
	            }
	            return (((sign)?'':'-') + '$' + num + '.' + cents);
	        },

	        round: function(value, decimals) {
	            var exponent = Math.pow(10, decimals);
	            return (Math.round(value * exponent) / exponent);
	        }
	    };
	}();
	
	function GasCalculator(opts) {
		if (!(this instanceof GasCalculator)) {
			return new GasCalculator(opts);
		}
				
		this.reset.call(this);
		this.init.call(this, opts);
		
		return this;
	}
	
	function Distance(value, units) {
	    var _km = value;
	    if (units == "miles") {
	        _km = convert.milesToKm(value);
	    }

	    this.getMiles = function() {
	        return convert.kmToMiles(_km);
	    }

	    this.getKm = function() {
	        return _km;
	    }
	}
	
	function CostPerVolume(value, volumeUnits) {
	    var _cost = value;
	    if (volumeUnits == "gallons") {
	        _cost = value / convert.gallonsToLitres(1);
	    }

	    this.getCostPerLitre = function() {
	        return _cost;
	    }

	    this.getTotalCost = function(volume) {
	        return volume.getLitres() * _cost;
	    }
	}
	
	function Volume(value, units) {
	    var _litres = value;
	    if (units == "gallons") {
	        _litres = convert.gallonsToLitres(value);
	    }

	    this.getGallons = function() {
	        return convert.litresToGallons(_litres);
	    }

	    this.getLitres = function() {
	        return _litres;
	    }

	    this.getString = function(units) {
	        if (units == "gallons") {
	            return "" + format.round(this.getGallons(), 2) + " gal.";
	        }
	        else {
	            return "" + format.round(this.getLitres(), 2) + " litres";
	        }
	    }
	}
	
	function Efficiency(value, units) {
	    var _lphk = value;
	    if (units == "mpg") {
	        _lphk = convert.mpgToLPer100km(value);
	    }

	    this.getMpg = function() {
	        return convert.lPer100kmToMpg(_lphk);
	    }

	    this.getLPer100km = function() {
	        return _lphk;
	    }

	    this.totalFuelUsed = function(distance) {
	        return new Volume(distance.getKm() * _lphk / 100, "l");
	    }
	}
	
	function CostPerUnitDistance(efficiency, costPerVolume) {
	    var _costPerKm = efficiency.getLPer100km() / 100 * costPerVolume.getCostPerLitre();

	    this.getCostPerKm = function() {
	        return _costPerKm;
	    }

	    this.getCostPerMile = function() {
	        return _costPerKm / convert.kmToMiles(1);
	    }
	}
	
	GasCalculator.prototype = {
		reset: function () {
			this.$container = null;			
			return this;
		},
		
		Distance: function(value, units){
			
		},
		init: function () {
			var self = this;
			self.$container = $('#pjGasCalcContainer');
			self.$container.show();
			var $form = $('#pjGasCalcForm');
			if (validate) 
			{
				$form.validate({
					onkeyup: false,
					errorElement: 'li',
					errorPlacement: function (error, element) {
						error.appendTo(element.next().find('ul'));
					},
		            highlight: function(ele, errorClass, validClass) {
		            	var element = $(ele);
		            	element.parent().removeClass('has-success').addClass('has-error');
		            },
		            unhighlight: function(ele, errorClass, validClass) {
		            	var element = $(ele);
		            	element.parent().removeClass('has-error').addClass('has-success');
		            },
		            submitHandler: function (form) {
		            	self.calculate.call(self);
		            	return false;
					}
				});
			}
			
			self.$container.on('change.gc', '#distanceUnits', function(e){
				self.distanceUnitsChanged.call(self);
				return false;
			}).on('click.gc', '.pjGcBtnReset', function(e){
				self.reset.call(self);
				return false;
			});
		},
		calculate: function() {
			
		    var distance = new Distance($("#distance").val(), $("#distanceUnits").val());
		    var fuelUsed = new Volume($("#fuelUsed").val(), $("#fuelUnits").val());
		    var unitFuelCost = new CostPerVolume($("#priceOfFuel").val(), $("#fuelPriceUnits").val());
		    
		    var efficiency = new Efficiency(distance.getMiles() / fuelUsed.getGallons(), "mpg");
		    $("#USFuelEfficiency").text(format.round(efficiency.getMpg(), 2));
		    $("#MetricFuelEfficiency").text(format.round(efficiency.getLPer100km(), 2));

		    var costPerDistance = new CostPerUnitDistance(efficiency, unitFuelCost);
		    $("#DollarsPerMile").text(format.formatCurrency(costPerDistance.getCostPerMile()));
		    $("#DollarsPerKm").text(format.formatCurrency(costPerDistance.getCostPerKm()));
		},
		distanceUnitsChanged: function(){
			var self = this;
			if ($("#fuelUsed").val() == "" && $("#priceOfFuel").val() == "") {
		        if ($("#distanceUnits").val() == "miles") {
		        	self.switchToUS.call(self);
		        }
		        else {
		            self.switchToMetric.call(self);
		        }
		    }
		},
		switchToUS: function(){
			var self = this;
			$("#distanceUnits").val("miles");
		    $("#fuelUnits").val("gallons");
		    $("#fuelPriceUnits").val("gallons");
		},
		switchToMetric: function(){
			var self = this;
			$("#distanceUnits").val("km");
		    $("#fuelUnits").val("litres");
		    $("#fuelPriceUnits").val("litres");
		},
		reset: function(){
			$("#USFuelEfficiency").text("0.0");
		    $("#MetricFuelEfficiency").text("0.0");
		    $("#DollarsPerMile").text(format.formatCurrency(0));
		    $("#DollarsPerKm").text(format.formatCurrency(0));
		    
		    $("#distance").val("");
		    $("#fuelUsed").val("");
		    $("#priceOfFuel").val("");
		    $("#gasCalculator input").removeClass("invalid");
		}
	};
		
	window.GasCalculator = GasCalculator;
})(jQuery_3_1_1, window);
