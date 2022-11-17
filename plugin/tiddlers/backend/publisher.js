/*\
title: $:/plugins/EvidentlyCube/Discloser/publisher.js
type: application/javascript
module-type: global

Module for doing the actual publishing

\*/
(function() {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	if (!$tw.node) {
		return;
	}

	const process = require('process');

	exports.EvidentlyCubeDiscloser_Publisher = {
		publishCollections: function(collectionTitles) {
			const renderCommands = [];
			const affectedDiscloserTiddlers = new Set();

			renderCommands.push('--output');
			renderCommands.push(`${process.cwd()}/output/`);

			$tw.utils.each(collectionTitles, function(title) {
				const collection = $tw.wiki.getTiddler(title);
				if (!collection || !collection.fields.id) {
					return;
				}

				affectedDiscloserTiddlers.add(title);

				const template = '$:/core/templates/static.tiddler.html';
				const collectionId = collection.fields.id;
				const linkTitles = $tw.wiki.filterTiddlers(`[all[tiddlers]tag[$:/discloser/Link]field:collection[${title}]]`);

				$tw.utils.each(linkTitles, function(linkTitle) {
					const link = $tw.wiki.getTiddler(linkTitle);
					if (!link || !link.fields.tiddler) {
						return;
					}

					const linkedTiddler = $tw.wiki.getTiddler(link.fields.tiddler);
					if (!linkedTiddler) {
						return;
					}

					affectedDiscloserTiddlers.add(linkTitle);

					const slugifiedTitle = link.fields.tiddler
						.toLowerCase()
						.replace(/^[^a-z0-9]+/, '')
						.replace(/[^a-z0-9]+$/, '')
						.replace(/[^a-z0-9]+/g, '-');
					const finalPath = `${collectionId}/${slugifiedTitle}.html`;
					renderCommands.push(...[
						'--render',
						`[[${link.fields.tiddler}]]`,
						finalPath,
						'text/plain',
						template
					]);
				});
			});

			const commander = new $tw.Commander(
				renderCommands,
				function(err) {
					console.log(err);
				},
				$tw.wiki,
				{output: process.stdout, error: process.stderr}
			);
			commander.execute();

			return Array.from(affectedDiscloserTiddlers);
		}
	};

	// setTimeout(() => {
		// $tw.EvidentlyCubeDiscloser_Publisher.publishCollections(["$:/discloser/Collection-60b98f55737ebe15ebf9656122278f3b","$:/discloser/Collection-c3f92207af85427a6de9873550f425b6"]);
	// }, 100);

}());
