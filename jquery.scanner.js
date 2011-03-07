/*
Copyright (c) 2011, Leon Sorokin
All rights reserved.

jquery.scanner.js - a nifty barcode scanning framework
*/

(function($){
	$.scanner = function(options) {
		var opts = $.extend(
			{
				startKey: "|",
				endKey: "\r",
				// scanned string parser (gets handed string with start/end indicators stripped)
				parser: function(scanStr){return scanStr;},
				scanBeep: null,
				preventOutput: true
			}, options),
			toplevel = document,		// maybe window?
			scanning = false,
			scan_buf = '',
			startKey = typeof opts.startKey == "string" ? opts.startKey.charCodeAt(0) : opts.startKey,
			endKey = typeof opts.endKey == "string" ? opts.endKey.charCodeAt(0) : opts.endKey;

			opts.scanBeep = opts.scanBeep && !!(document.createElement('audio').canPlayType) ? new Audio(opts.scanBeep) : null;

		$(toplevel).keypress(function(e){
			if (!scanning && e.which == startKey) {
				// start capturing
				scanning = true;
				// prevent startKey output
				return false;
			}
			else if (scanning) {
				if (e.which == endKey) {
					// stop capturing
					scanning = false;
					// invoke parser
					var scanData = opts.parser(scan_buf);
					// clear buffer
					scan_buf = '';
					// normalize top-level scannable node
					if (/html|body/i.test(e.target.nodeName)) {
						e.target = toplevel;
					}
					// trigger scan event
					$(e.target).trigger('scan', [scanData]);
					// play scan beep if provided
					opts.scanBeep && opts.scanBeep.play();
					// prevent endKey output
					return false;
				}
				else {
					// buffer character
					scan_buf += String.fromCharCode(e.which);
				}

				// output or not output buffered character
				return !opts.preventOutput;
			}
		});
	}
})(jQuery);