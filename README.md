# McSandy: The HTML5 offline Sandbox #

A SFA (Single File Application ) that acts as your HTML, CSS, and JavaScript editor;

 * Version: 0.2.0
 * License: Copyright 2014 Frank M. Taylor. All Rights Reserved
 * Prerequisites: IE10+, other modern browsers

## FAQs ##
###What's an SFA? ###

An SFA is a Single File Application. This means the entire application functions in a single file - no installation, extra files, or internet, is required to use it. Once you've downloaded McSandy (index.html), that's all you need. At 350 lines, that's not too bad, right?

### What can I do with McSandy? ###
McSandy lets you edit HTML, CSS and JavaScript with a live preview. Every time you leave the HTML, CSS, or JavaScript fields (with the tab button), live preview will be updated. You'll have a live-reload with the CSS. 

### Can I save my work? ###
Of course you can! McSandy uses `localstorage` to save your projects. You can save and delete any of your projects

###Can I export my work? ###
Not yet, but that is an upcoming feature. You will be able to export 
  
### What are the technologies that McSandy uses? ###
McSandy is an HTML5 application. It's using Vanilla JavaScript, but it makes use of three API's in particular
 + localStorage (for storing data)
 + `online` (for showing whether you have internet)
 + Blob URLs (for doing the live-preview in an iframe)

McSandy also uses the Flexbox module for its layout. Flexbox is supported in IE10+ 


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

## Upcoming To-dos ##
 + fix the delete button CSS. right now it's always *not* showing. we only want it to show when a project has been loaded



 



	       
