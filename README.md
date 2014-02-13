McSandy: The HTML5 offline Sandbox
Author: Frank M. Taylor
Dependencies: jQuery 1.7.1.min.js
Requirements: Google Chrome V17+ ,FireFox jQuery in same directory as the playground.html file
APIs: File System, LocalStorage, Blobs, Network Information
Usage: Make sure that jQuery is in the same directory as the file. 
Version:
   1
	.01 :: 	initial upload
	.02 :: 	added some interactive CSS for hovers of buttons, a touch o' shadows
	.03 :: 	Storing CSS and JS
	       	Converting CSS and JS to strings so the actual result works
	       	Removed the incompleted indexedDB script
	.04 :: 	changed the content variable to an array. 
	       	Using JSON.stringify and JSON.parse to and from storage
	       	minified the CSS
	.05 :: 	FireFox Support finally. Using an if-then to detect the browser specific extensions
		   	detecting whether user has internet connection, showing that in upper right
		   	Added a title to the editing section and the iframe section
		   	HTML section displays upon page load
		   	first item stored in local storage loads upon page load
		   	Brightened the color of the nav 
		   	color for :hover and :focus of buttons
		   	changed widths and displays of the sections so that switching from HTML->js doesn't cause page skipping
		   	added TABINDEX to the HTML->JS switchers and tabs
	.06 :: 	Iframe refreshes as you type (bound an event to #content and #css)
		   	Added an online/offline indicator to tell user if there's an internect connection
	.07	:: 	Meyer reset is auto inserted into the CSS for the iframe
			Putting the playground's jquery reference in the iframe (so jquery is now supported)
			keyboard controls: ctrl + ~ hides the codebox
			Error message will display if blob URLs aren't supported. 


Upcoming:
	a "run" button for the javascript so user can type JS without it automatically running 
	automatically take user back to HTML when changing saved item
	Export HTML / CSS / JS into files (probably a 2.0 version)

Known Defects / issues:
	required doubleclick to switch from one type of code to the next
	Code loses user's formatting when it's reloaded
	Save button doesn't auto refresh the iframe



	       
License: Copyright 2012 and All Rights Reserved by Frank Marshall Taylor