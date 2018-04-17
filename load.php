<?php
ob_start();
header("Content-Type: text/javascript; charset=utf-8"); 
?>
<div id="pjGasCalcContainer" class="container" style="display:none;">
	<h2 class="text-center">Gas Mileage Calculator</h2>
	
	<form id="pjGasCalcForm" action="#" method="post" enctype="multipart/form-data" class="form-horizontal">
	    <div class="form-group">
	      	<label class="control-label col-sm-4">Distance Driven</label>
	      	<div class="col-sm-2">
	      		<input type="text" id="distance" name="distance" class="form-control number required" />
	        	<div class="help-block with-errors"><ul class="list-unstyled"></ul></div>
	      	</div>
	      	<div class="col-sm-2">
	      		<select id="distanceUnits" name="distanceUnits" class="form-control">
					<option value="miles">Miles</option>
					<option value="km">km</option>
				</select>
	      	</div>
	    </div>
	    <div class="form-group">
	      	<label class="control-label col-sm-4">Gas Used</label>
	      	<div class="col-sm-2">
	      		<input type="text" id="fuelUsed" name="fuelUsed" class="form-control number required" />
	        	<div class="help-block with-errors"><ul class="list-unstyled"></ul></div>
	      	</div>
	      	<div class="col-sm-2">
	      		<select id="fuelUnits" name="fuelUnits" class="form-control">
					<option value="gallons">Gallons</option>
					<option value="litres">Litres</option>
				</select>
	      	</div>
	    </div>
	    <div class="form-group">
	      	<label class="control-label col-sm-4">Price of Gas</label>
	      	<div class="col-sm-2">
	      		<input type="text" id="priceOfFuel" name="priceOfFuel" class="form-control number required"/>
	        	<div class="help-block with-errors"><ul class="list-unstyled"></ul></div>
	      	</div>
	      	<div class="col-sm-2">
	      		<select id="fuelPriceUnits" name="fuelPriceUnits" class="form-control">
					<option value="gallons">$ per Gallon</option>
					<option value="litres">$ per Litre</option>
				</select>
	      	</div>
	    </div>
	    <div class="form-group">
		    <div class="col-sm-offset-4 col-sm-8">
		    	<button type="submit" class="btn btn-primary">Calculate</button>
		    	<button type="button" class="btn btn-default pjGcBtnReset">Reset</button>
		    </div>
		</div>
		
		<div class="form-group">
	      	<label class="col-sm-offset-1 col-sm-8 text-center"><h3 class="text-center">Result</h3></label>
	    </div>
	    
	    <div class="form-group">
		    <div class="col-sm-offset-1 col-sm-8">
	      	<label class="col-sm-4 text-right">Consumption</label>
	      	<div class="col-sm-4 text-right">
	      		<span id="USFuelEfficiency">0.0</span> MPG
	      	</div>
	      	<div class="col-sm-4 text-right">
	      		<span id="MetricFuelEfficiency">0.0</span> L/100km
	      	</div>
			</div>
	    </div>
	    <div class="form-group">
		    <div class="col-sm-offset-1 col-sm-8">
	      	<label class="col-sm-4 text-right">Cost per Distance</label>
	      	<div class="col-sm-4 text-right">
	      		<span id="DollarsPerMile">$0.00</span> per Mile
	      	</div>
	      	<div class="col-sm-4 text-right">
	      		<span id="DollarsPerKm">$0.00</span> per km
	      	</div>
			</div>
	    </div>
	</form>
	
</div>
<script type="text/javascript">
var GasCalculator;
(function () {
	"use strict";
	var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),

	loadCssHack = function(url, callback){
		var link = document.createElement('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = url;

		document.getElementsByTagName('head')[0].appendChild(link);

		var img = document.createElement('img');
		img.onerror = function(){
			if (callback && typeof callback === "function") {
				callback();
			}
		};
		img.src = url;
	},
	loadRemote = function(url, type, callback) {
		if (type === "css" && isSafari) {
			loadCssHack(url, callback);
			return;
		}
		var _element, _type, _attr, scr, s, element;
		
		switch (type) {
		case 'css':
			_element = "link";
			_type = "text/css";
			_attr = "href";
			break;
		case 'js':
			_element = "script";
			_type = "text/javascript";
			_attr = "src";
			break;
		}
		
		scr = document.getElementsByTagName(_element);
		s = scr[scr.length - 1];
		
		if(typeof s == "undefined") {
			scr = document.getElementsByTagName("script");
			s = scr[scr.length - 1];
		}
		
		element = document.createElement(_element);
		element.type = _type;
		if (type == "css") {
			element.rel = "stylesheet";
		}
		if (element.readyState) {
			element.onreadystatechange = function () {
				if (element.readyState == "loaded" || element.readyState == "complete") {
					element.onreadystatechange = null;
					if (callback && typeof callback === "function") {
						callback();
					}
				}
			};
		} else {
			element.onload = function () {
				if (callback && typeof callback === "function") {
					callback();
				}
			};
		}
		element[_attr] = url;
		s.parentNode.insertBefore(element, s.nextSibling);
	},
	loadScript = function (url, callback) {
		loadRemote(url, "js", callback);
	},
	loadCss = function (url, callback) {
		loadRemote(url, "css", callback);
	};
	loadScript("js/jquery-3.1.1.min.js", function () {
		loadScript("js/bootstrap.min.js", function () {
			loadScript("js/jquery.validate.min.js", function () {
				loadScript("js/function.js", function () {
					loadCss("css/bootstrap.min.css", function() {
						loadCss("css/bootstrap-theme.min.css", function() {
							loadCss("css/style.css", function() {
								GasCalculator = GasCalculator();
							});
						});
					});
				});
			});
		});
	});
})();
</script>
<?php
$content = ob_get_contents();
ob_end_clean();

$content = preg_replace('/\r\n|\n|\t/', '', $content);
$content = str_replace("'", "\"", $content);
echo "document.writeln('$content');" 
?>
