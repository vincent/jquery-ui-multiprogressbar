/*jslint white: true vars: true browser: true todo: true */
/*jshint camelcase:true, plusplus:true, forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, maxerr:100, white:false, onevar:false */
/*global noty:true jQuery:true $:true sprintf:true Roundizzle:true */

(function ($, undefined) {
	"use strict";

$(document).ready(function() {
	
	test("basic markup expansion", function() {
		var testElement = $('#multiprogressbartest');
		var parts = [{value: 10},
					{value: 30},
					{value: 15}];
		testElement.multiprogressbar({
			parts: parts
		});
		ok(testElement.hasClass("ui-multiprogressbar"), 'Verify that the expansion worked at all');
		
		var partElements = testElement.children(".ui-progressbar-value");
		strictEqual(partElements.length, 3, 'Verify that the parts have been created');
		var testElementWidth = parseInt(testElement.css('width'));
		partElements.each(function(index, partElement) {
			var percentualWidth = Math.round(parseInt($(partElement).css('width')) / testElementWidth * 100);
			strictEqual(percentualWidth, parts[index].value, 'Verify that the width of part '+index+' is correct');
		});
	});
	
	test("part text markup", function() {
		var testElement = $('#multiprogressbartest');
		var parts = [{value: 17, text: true},
		 			{value: 5, text: false},
		 			{value: 8},
					{value: 31, text: 'Foo'}];
		testElement.multiprogressbar({
			parts: parts
		});
		equal(testElement.text(),"17%Foo", 'Verify that there is no text other than the expected text');
		
		var partElements = testElement.children('.ui-progressbar-value');
		partElements.each(function(index, partElement) {
			if (parts[index].text) {
				strictEqual($(partElement).children('.ui-multiprogressbar-valuetext').length, 1, 'Verify that part '+index+' has a value text');
				if (parts[index].text === true) {
					strictEqual($(partElement).text(), parts[index].value+"%", 'The text of the part should be its progress value');
				}
				else if (parts[index].text){
					strictEqual($(partElement).text(), parts[index].text, 'The text of the part is a custom text');
				}
			}
			else {
				strictEqual($(partElement).text(), "", 'The part should not contain text');
			}
		});
	});
	
	test("part styling", function() {
		var testElement = $('#multiprogressbartest');
		var parts = [{value: 10, barClass: "bar1 bar2", text: true, textClass:"text1 text2"}];
		testElement.multiprogressbar({
			parts: parts
		});
		
		ok(testElement.children('.ui-progressbar-value').first().hasClass("bar1"), 'Verify the classes were added to the bar');
		ok(testElement.children('.ui-progressbar-value').first().hasClass("bar2"), 'Verify the classes were added to the bar');
		ok(testElement.find('.ui-multiprogressbar-valuetext').first().hasClass("text1"), 'Verify the classes were added to the text');
		ok(testElement.find('.ui-multiprogressbar-valuetext').first().hasClass("text2"), 'Verify the classes were added to the text');
	});
	
	test("changing settings after creation", function() {
		var testElement = $('#multiprogressbartest');
		testElement.multiprogressbar(); // Empty progressbar
		strictEqual(testElement.children('.ui-progressbar-value').length, 1, 'Verify the progressbar contains one part');
		strictEqual(testElement.children('.ui-progressbar-value').first().css("width"), '0px', 'Verify the one part is empty');
		
		var parts = [{value: 10, text: true},
					{value: 7, text: true}];
		testElement.multiprogressbar('option', 'parts', parts);
		strictEqual(testElement.children('.ui-progressbar-value').length, 2, 'Verify that there are two parts now');
		strictEqual(testElement.text(), '10%7%', 'Verify that the parts have the correct width (verified via part text)');
	});
	
	module('event tests', {
		teardown: function() {
			$('#qunit-fixture').off();
		}
	});
	test("event triggering", function() {
		var expectedEvents = [ 'create', 'change', 'change', 'complete' ];
		var expectedEventsIndex = 0;
		expect(expectedEvents.length);
		
		$('#qunit-fixture').on('multiprogressbarcreate', '.ui-multiprogressbar', function() {
			strictEqual(expectedEvents[expectedEventsIndex], 'create', "create triggered");
			expectedEventsIndex += 1;
		});
		$('#qunit-fixture').on('multiprogressbarchange', '.ui-multiprogressbar', function() {
			strictEqual(expectedEvents[expectedEventsIndex], 'change', "change triggered");
			expectedEventsIndex += 1;
		})
		
		$('#qunit-fixture').on('multiprogressbarcomplete', '.ui-multiprogressbar', function() {
			strictEqual(expectedEvents[expectedEventsIndex], 'complete', "complete triggered");
			expectedEventsIndex += 1;
		})

		var testElement = $('#multiprogressbartest');
		// Trigger create
		testElement.multiprogressbar({parts: [{value: 10}]});
		
		// Trigger change
		testElement.multiprogressbar('option', 'parts', [{value: 5}]);
		
		// Trigger change and then complete
		testElement.multiprogressbar('option', 'parts', [{value: 50}, {value: 50}]);
	});
	
});
	
}(jQuery));