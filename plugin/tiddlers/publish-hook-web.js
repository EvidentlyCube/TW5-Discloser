/*\
title: $:/plugins/EvidentlyCube/Discloser/publish-hook-web.js
type: application/javascript
module-type: startup

Tracks for publish message and sends it to the backend.

\*/

(function(){

/*jslint node: false, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "evidentlycube-discloser-publish-hook-web";
exports.after = ["startup"];
exports.synchronous = true;

const PENDING_REFRESH_TITLE = "$:/plugins/EvidentlyCube/Discloser/pending-refresh";

exports.startup = function() {
	if ($tw.node) {
		return;
	}

	$tw.rootWidget.addEventListener('ec-discloser-publish', function() {

	});
};

})();
