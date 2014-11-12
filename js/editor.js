
var storage	= {};
var pref	= {};
var editor	= {};
var _File	= function(path){

	return {
	
		toString : function(){

			return '<html>\n\t<head>\n\t</head>\n\t<body>\n\t</body>\n</html>';
		}
	}

};

var _studio		= {

	extension : {
	
		storage : {
		
			getItem : function( item ){			
			
				switch ( item ) {
				
					case 'mode':
						return 'htmlmixed';
				
				}
				
			}
		
		}
	
	},
	
	File : _File
	
};

var studio	= studio || _studio;

editor.events	= {};
editor.config	= {};

storage.get	= function( key ) {

	var value	= studio.extension.storage.getItem( key );
 
	return value;
};

storage.set	= function( key , value ) {

	studio.extension.storage.setItem( key , value );

};

pref.get	= function( key ) {

	var value	= studio.extension.getPref( key );
 
	return value;
};

pref.set	= function( key , value ) {

	studio.extension.setPref( key , value );

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

	$('#state').text('Saving..');

	var filePath	= storage.get( 'file' );
	var file		= studio.File( filePath );
	
	if ( !editor.cm.isClean() ) {
	
		studio.saveText( editor.cm.getValue( ) , file );
		
		editor.events.trigger('onSave');
		
	};
	
	$('#state').text('Saved');
	
	setTimeout(function(){ $('#state').text('OK'); },1000);

};

editor.events.trigger	= function( name , args ) {

	for ( var i in editor.events[ name ] ) {
	
		try{
		
			editor.events[ name ][ i ].apply(null,args);
		}catch( e ) {}
	
	}

}

editor.init = function( ) {

	editor.events.onSave	= [];

	editor.cm = CodeMirror.fromTextArea( editor.getTextArea() , {

		lineNumbers: true
		
	});

	CodeMirror.modeURL = "lib/codemirror/mode/%N/%N.js";
	
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
	editor.setOption( "indentUnit" , 4 );	
	
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

	return pref.get('theme')||'eclipse';
	
};

editor.setTheme = function ( theme ) {

	pref.set('theme',theme);

	editor.setOption( "theme" , theme );

};


/*
 * Init
 */

editor.init();