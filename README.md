# McSandy: The HTML5 offline Sandbox #

A SFWA (Single File Web Application ) that acts as your HTML, CSS, and JavaScript editor.

 * Version: 0.2.1
 * License: Copyright 2014 Frank M. Taylor. All Rights Reserved
 * Prerequisites: IE10+, other modern browsers that support CSS flexbox and blob urls

## McSandy's Features ##
McSandy isn't the only web-based, live preview editor out there. Here's what makes McSandy unique:
 
 + McSandy let you save your work into local storage
 + Your project gets a hashable url, so you can bookmark it: `mcsandy.html#myawesomeproject`
 + You can export your work into an HTML file (it's that <kbd>download</kbd> button)
 + You can drag HTML, CSS, or JavaScript files into the edit fields to edit them.
 + You can drag your HTML, CSS, or JavaScript fields to your desktop to save them
 + McSandy knows when you have an internet connection and uses any external libraries appropriately
 + McSandy is a single file: mcsandy.html
 + McSandy doesn't need an internet connection


## Keyboard Shortcuts ##
 + <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>i</kbd>: Toggle information window


 + <kbd>ctrl</kbd> + <kbd>s</kbd>: save
 + <kbd>ctrl</kbd> + <kbd>r</kbd>: run
 + <kbd>ctrl</kbd> + <kbd>d</kbd>: download
 + <kbd>ctrl</kbd> + <kbd>l</kbd>: load
 + <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>e</kbd>: toggle editor
 + <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>p</kbd>:  toggle projects
 + <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>del</kbd>:   delete project
 + <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>+</kbd>:  New Project
 + <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>h</kbd>: toggle Horizontal layout

### The Technologies Behind McSandy ###
McSandy is an HTML5 application. It's using Vanilla JavaScript, but it makes use of three API's in particular
 + localStorage (for storing data)
 + `online` (for showing whether you have internet)
 + Blob URLs (for doing the live-preview in an iframe)
 + fileReader for reading and generating files
 + drag and drop (for dropping files into your edit areas)
 + [Eli Grey](http://eligrey.com/blog/post/saving-generated-files-on-the-client-side)'s [filesaver.js](https://github.com/eligrey/FileSaver.js) is used for the export, until a McSandy-specific solution is developed. 
 + CSS3's Flexbox module for layout. Flexbox is supported in IE10+ 

## Upcoming Features ##
 + manually enter external libraries
 + drag in/out additional files (that you don't want to edit)
 + "tips" window for seeing available keyboard shortcuts
 + warning/alert window for various errors

## FAQs ##
###What's an SFWA? ###

An SFWA is a Single File Web Application. This means the entire application functions in a single html file. There are no dependencies on any external libraries. Once you've downloaded McSandy (mcsandy.html), you're ready to start coding. 


### How can I save my work? ###
McSandy uses `localstorage` to save your projects. You can save and delete any of your projects by clicking on the save button at the bottom, or by using the keyboard command <kbd>ctrl</kbd> + <kbd>s</kbd>

### How can I get my work back? ###
At the bottom of McSandy, there's a select box where you can retrieve your old projects. Select the project and just click the <kbd>load</kbd> button. 

You can also retrieve your projects as a hash in the URL: `mcsandy.html#my_project`. 

This means that you can bookmark your projects!

### How can I add external files? ###
McSandy gives you the option to load JavaScript libraries from Google's CDN. In the future, you'll be able to add your own JS Libraries, too. 

### How can I export my work? ###
At the bottom of McSandy is a <kbd>download</kbd> button. This will export your current project to a static HTML file. 


### How can I make it better ?
If you'd like to contribute, just pull the repo. All of the 'editable' assets are in the `preAssets` folder. The HTML files are in their own folder.  Grunt.js will build the files in `postAssets`, and generate a file called `post-mcsandy.html` for you. 






	       
