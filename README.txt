this framework is a somewhat different from other JS barcode scanning frameworks in that it requires user-specified start and end characters to indicate that a "scan" event, not user keyboard input, is taking place - these prefixes/suffixes must be programmed into the scanner using the manufacturer's provided software. the pattern is designed for an interface which may accept both user input and barcode scans. barcode scans may have non-barcode (namespacing) infomation appended to the scan strings, such as scanner_id, station_id, allowing multiple scanners to work concurrently within the same browser window (eg: five QC stations arranged around a single data-collection PC). a custom parser function takes care of parsing and stripping scanner meta-data and sending it to the correct place on the UI or server.

overview:
1. configure your scanner(s) to prefix all scanned data with a character that is unlikely to be keyboard-typed by a user. eg: "|".
2. initialize the framework with the needed options, including the prefix chosen in step 1 (it will automatically be stripped)
3. optionally specify a parser for scanned strings which will classify different types of barcodes
4. catch the "scan" event which will be triggered and bubble from the focused input or document if none is focused

// initialization showing all options with defaults
$.scanner({
	startKey: "|",							// default scan-start indicator
	endKey: "\r",							// default scan-end indicator
	parser: (scanStr){return scanStr;},		// default basic parser. returned data will be passed to "scan" event's handlers
	scanBeep: null,							// path to an optional scan beep sound to play via HTML5 audio (if present)
	preventOutput: true						// default behavior is to prevent output of scans
});

-----------------example usage-----------------------
// define a more complex parser and classifier
// scan string formats handled: 10_12345, 10_123456
function complexParser(scanStr) {
	var data = {
		_raw: scanStr,
		class: null,
		scanner_id: scanStr.slice(0,2),		// 2 digit scanner id prefix
		barcode: scanStr.slice(3)			// scanned barcode
	};
	
	// classify barcode type, 5-digit are serial numbers, 6-digit are order numbers
	data.class = data.barcode.length == 5 ? "serial" : data.barcode.length == 6 ? "order" : null;
	
	return data;
}

$.scanner({
	parser: complexParser
});

// bind handler for scanned/parsed data
$(document).bind("scan", function(e, data){
	console.log(data._raw);
	console.log(data.class);
	console.log(data.scanner_id);
	console.log(data.barcode);
});

-----------------TODO-----------------------
- some way to trigger app-level success/fail beeps based on valid parsing and acceptance of scanned barcodes into various scan contexts or containers. for now this has to be done in "scan" event handlers. meh.