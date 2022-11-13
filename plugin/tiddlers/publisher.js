/*\
title: $:/plugins/EvidentlyCube/Discloser/publisher.js
type: application/javascript
module-type: startup

Performs the actual publishing of the tiddlers
\*/

(function(){

/*jslint node: false, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "evidentlycube-discloser-publish";
exports.before = ["startup"];
exports.synchronous = true;

exports.startup = function() {
	if (!$tw.node) {
		return;
	}

	var collectionToTiddlers = new Map();
	var tiddlerToCollections = new Map();

	rebuildCache();
	console.log(collectionToTiddlers);
	console.log(tiddlerToCollections);

	function rebuildCache() {
		var tiddlerNames = $tw.wiki.getTiddlers({includeSystem: true});

		for(var i = 0; i < tiddlerNames.length; i++) {
			var tiddler = $tw.wiki.getTiddler(tiddlerNames[i]);

			additiveCacheUpdate(tiddler);
		}
	}

	function additiveCacheUpdate(tiddler) {
		if (!tiddler || !tiddler.fields.tags || tiddler.fields.tags.indexOf('$:/discloser/Link') === -1) {
			return;
		}

		var collectionName = tiddler.fields.collection;
		var tiddlerName = tiddler.fields.tiddler;

		if (!collectionName || !tiddlerName) {
			return
		}

		var tiddlersInCollection = collectionToTiddlers.get(collectionName) ?? [];
		tiddlersInCollection.push(tiddlerName);
		collectionToTiddlers.set(collectionName, tiddlersInCollection);

		var collectionsWithTiddler = tiddlerToCollections.get(tiddlerName) ?? [];
		collectionsWithTiddler.push(collectionName);
		tiddlerToCollections.set(tiddlerName, collectionsWithTiddler);
	}

	function subtractiveCacheUpdate(tiddler) {
		if (!tiddler || !tiddler.fields.tags || tiddler.fields.tags.indexOf('$:/discloser/Link') === -1) {
			return;
		}

		var collectionName = tiddler.fields.collection;
		var tiddlerName = tiddler.fields.tiddler;

		if (!collectionName || !tiddlerName) {
			return
		}

	}

	$tw.wiki.addEventListener("change",function(changes) {
		console.log(changes);
	});
};

})();
