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

	exports.EvidentlyCubeDiscloser_PublishCollections = function(collectionTitles) {
		const renderCommands = [];
		const affectedDiscloserTiddlers = new Set();

		renderCommands.push('--output');
		renderCommands.push(`${process.cwd()}/output/`);

		$tw.utils.each(collectionTitles, function(collectionTitle) {
			const collection = $tw.wiki.getTiddler(collectionTitle);
			if (!collection || !collection.fields.id) {
				return;
			}

			affectedDiscloserTiddlers.add(collectionTitle);

			const template = '$:/core/templates/static.tiddler.html';
			const collectionId = collection.fields.id;
			const linkTitles = getValidLinks(collectionTitle);

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

				const slugifiedTitle = slugifyTitle(link.fields.tiddler);
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

	function getValidLinks(linkTitles) {
		$tw.wiki.filterTiddlers(`[all[tiddlers]tag[$:/discloser/Link]field:collection[${title}]]`);
	}

	function generateSlugifiedTitleMap(linkTitles) {
		const map = new Map();

		$tw.utils.each(titles, function(title) {

		});

		return map;
	}

	function slugifyTitle(title) {
		return title
			.toLowerCase()
			.replace(/^[^a-z0-9]+/, '')
			.replace(/[^a-z0-9]+$/, '')
			.replace(/[^a-z0-9]+/g, '-');
	}
}());
