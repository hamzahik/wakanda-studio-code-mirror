/* Copyright (c) 4D, 2012
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* The Software shall be used for Good, not Evil.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

var actions = {};

actions.editFile = function editFile( message ) {
	"use strict";
	var files = studio.currentSolution.getSelectedItems();
	if ( files.length != 0 ) {
	
		var file	= files[ 0 ];
		var mode	= '';
		
		switch ( file.extension.toLowerCase() ) {
		
			case 'js':
				mode = 'javascript';
				break;
			case 'html':
				mode = 'htmlmixed';
				break;
			case 'css':
				mode = 'css';
				break;
			case 'waperm':
			case 'xml':
				mode = 'xml';
				break;
			default:
				mode = 'htmlmixed';			
		};
		
		studio.extension.storage.setItem( 'extension' , studio.extension.getFolder().path );
		studio.extension.storage.setItem( 'mode' , mode );
		studio.extension.storage.setItem( 'file' , files[ 0 ] .path );
		studio.extension.openPageInTab('./editor.html',file.name,true);
		
	};
	
	return true;
};

exports.handleMessage = function handleMessage(message) {
	"use strict";
	var
		actionName;

	actionName = message.action;

	if (!actions.hasOwnProperty(actionName)) {
		studio.alert("I don't know about this message: " + actionName);
		return false;
	}
	actions[actionName](message);
};

