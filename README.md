# McSandy: The HTML5 offline Sandbox #

A SFA (Single File Application ) that acts as your HTML, CSS, and JavaScript editor;

 * Version: 0.2.1
 * License: Copyright 2014 Frank M. Taylor. All Rights Reserved
 * Prerequisites: IE10+, other modern browsers that support CSS flexbox and blob urls

## FAQs ##
###What's an SFA? ###

An SFA is a Single File Application. This means the entire application functions in a single file - no installation, extra files, or internet, is required to use it. Once you've downloaded McSandy (mcsandy.html), that's all you need.

### What can I do with McSandy? ###
McSandy lets you edit HTML, CSS and JavaScript with a live preview. Every time you keyup in the HTML or CSS fields, live preview will be updated. When you `tab` away from the JavaScript field, that will also run it. At any time, you can use `ctrl` + `r` to preview your project. 

### Can I save my work? ###
Of course you can! McSandy uses `localstorage` to save your projects. You can save and delete any of your projects by clicking on the save button at the bottom, or with `ctrl` + `s`.

### How can I get my work back? ###
At the bottom of McSandy, there's a select box where you can retrieve your old projects. Select the project and just click the `load` button. 

You can also retrieve your projects as a hash in the URL: `mcsandy.html#my_project`. 

This means that you can bookmark your projects!

###Can I export my work? ###
Yes. At the bottom of McSandy is a `download` button. This will export your current project to a static HTML file. 

In future versions, you will have the option to export each section of code. 

### Awesome, so what do I need to use it? ###
It's super simple. Download Mcsandy.html and get started! 

### What are the technologies that McSandy uses? ###
McSandy is an HTML5 application. It's using Vanilla JavaScript, but it makes use of three API's in particular
 + localStorage (for storing data)
 + `online` (for showing whether you have internet)
 + Blob URLs (for doing the live-preview in an iframe)
 + [Eli Grey](http://eligrey.com/blog/post/saving-generated-files-on-the-client-side)'s [filesaver.js](https://github.com/eligrey/FileSaver.js) is used for the export, until a McSandy-specific solution is developed. 

McSandy also uses the Flexbox module for its layout. Flexbox is supported in IE10+ 


### How can I make it better ?
If you'd like to contribute, just pull the repo. All of the 'editable' assets are in the `preAssets` folder. The HTML files are in their own folder.  Grunt.js will build the files in `postAssets`, and generate a file called `post-mcsandy.html` for you. 

## Upcoming Features ##
 + add external JS/CSS (will require offline validation to make sure that it'll work if no internet)
 + editor validation
 + last project-restore


## Recently done ##
 + got the flex layout working properly, header, main area, and footer distributely evenly
 + can now load projects from local storage
 + loading projects from LS puts the content in the editors
 + can delete projects
 + changed orientation of the editor buttons
 + can now save with `ctrl + s`
 + live updating when editing the CSS
 + corrected font in editor boxes
 + Can now load a project by simply adding the name of the project as a hash to the url: `index.html#test`
 + fixed animation for expand collapse sections
 + improved the UI a bit, set the theme around one central color, threw some stylus variables around it
 + load button, instead of loading when user chooses select button
 + header hides after initial page load. 
 + the Title element is also updated with online/offline state
 + shortcut for running JS: `ctrl` + `r`
 + Export to File for the project

## Known issues ##
 + McSandy adds jQuery to the live preview, but jQuery doesn't work unless McSandy is running on a local server. 



 



 



	       
