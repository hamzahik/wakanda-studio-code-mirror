
var storage	= {};
var editor	= {};

editor.config	= {};

storage.get	= function( key ) {

	var value	= studio.extension.storage.getItem( key );
 
	return value;
};

storage.set	= function( key , value ) {

	studio.extension.storage.setItem( key , value );

};

editor.setOption = function( option , value ) {

	editor.cm.setOption( option , value );

};

editor.getTextArea = function( ) {
	
	var textarea	= document.getElementById('editor');
	
	editor.config.textarea	= textarea;
	
	return textarea;
};

editor.loadFile = function( ) {

	var filePath	= storage.get( 'file' );
	var file		= studio.File( filePath );
	
	editor.cm.setValue( file.toString() );
	
	editor.cm.markClean();
};

editor.save = function( ) {

	var filePath	= storage.get( 'file' );
	var file		= studio.File( filePath );
	
	if ( !editor.cm.isClean() ) {
	
		studio.saveText( editor.cm.getValue( ) , file );
		
	};

};

editor.init = function( ) {

	editor.cm = CodeMirror.fromTextArea( editor.getTextArea() , {

		lineNumbers: true
		
	});

	CodeMirror.modeURL = "lib/codemirror/mode/%N/%N.js";

	editor.setTheme( editor.getTheme() );
	
	editor.setMode( editor.getMode() );
	
	editor.loadFile();
	
};

/*
 * Mode
 */
editor.getMode	= function( ) {
	
	var mode	= storage.get( 'mode' );
	
	editor.config.mode		= mode;
	
	return mode;
};

editor.setMode = function( mode ) {
	
	editor.setOption( "mode" , mode );
	
	if ( mode == "htmlmixed" ) {
	
		editor.setOption( "profile" , "html" );
		
	} else if ( mode == "javascript" ) {		
		
		var code	= studio.loadText( storage.get('extension') + 'ecma5.json' );
		
		editor.server = new CodeMirror.TernServer({defs: [JSON.parse( code )]});	
		
		editor.cm.on("cursorActivity", function(cm) { editor.server.updateArgHints(cm); });
		
	};
	
	editor.cm.setOption( "extraKeys" , {
		
	  "Ctrl-Space": function(cm) { editor.server.complete(cm); },		  
	  "Ctrl-I": function(cm) { editor.server.showType(cm); },
	  "Alt-.": function(cm) { editor.server.jumpToDef(cm); },
	  "Alt-,": function(cm) { editor.server.jumpBack(cm); },
	  "Ctrl-Q": function(cm) { editor.server.rename(cm); },
	  "Ctrl-.": function(cm) { editor.server.selectName(cm); },
	  "Ctrl-S": function(cm) { editor.save(cm); }
	});
	
	CodeMirror.autoLoadMode( editor.cm , mode );

};

/*
 * Theme
 */
editor.getTheme = function( ) {

	return 'monokai';
	
};

editor.setTheme = function ( theme ) {

	editor.setOption( "theme" , theme );

};


/*
 * Init
 */

editor.init();
