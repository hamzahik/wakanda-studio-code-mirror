var app	= angular.module('CodeEditor',[]);

app.controller('Toolbar',[ '$scope' , function( $scope ){

	$scope.items	= [	
		{
		
			title : "save",
			action: editor.save,
			_class: "glyphicon-floppy-disk"
		
		},
		{
			id 		: 'preview',
			
			init	: function(){
			
				editor.events.onSave.push( function(){
					
					var item	= $scope.getItemById('preview');
					
					if ( item.visible ){
					
						item.refresh();
					
					}
				
				} );
			
			},
		
			_class : 'glyphicon-eye-open',

			action : function(item){
			
				if ( editor.config.mode != 'htmlmixed' ){
					
					alert( 'this is not an HTML file' );
					
					return;
				
				}
			
				if ( item.visible ){
					$('#preview').hide();
					$('#c_editor').removeClass('col-md-6 col-sm-6');
					$('#c_editor').addClass('col-md-12 col-sm-12');
					item.visible	= false;
				
				} else {
					$('#preview iframe').attr('src','file:///' + storage.get('file'));
					$('#preview').show();
					//item.refresh();					
					$('#c_editor').removeClass('col-md-12 col-sm-12');
					$('#c_editor').addClass('col-md-6 col-sm-6');
					item.visible	= true;
					
				}
				
			},
			
			refresh	: function(){		
				
				$('#preview iframe')[0].contentWindow.location.reload();
			
			},
			
			title : 'preview'
		
		}
	];
	
	$scope.themes	= [ 'monokai' , 'eclipse' , 'mdn-like' , 'ambiance','night','neat','elegant'];
	
	$scope.$watch('theme',function(_new){
	
		if ( _new ) {
		
				editor.setTheme( _new );
		
		}
	
	});
	
	$scope.getItemById	= function( id ) {
	
		for ( var i in $scope.items ) {
		
			var item	= $scope.items[ i ];
			
			if ( item.id == id ) {
			
				return item;
			
			}
		
		}
	
	}
	
	$scope.theme	= editor.getTheme();
	
	for ( var i in $scope.items ) {
		
		var item	= $scope.items[ i ];
		
		try {
		
			item.init && item.init();
			
		} catch( e ) {}
	
	}
	
}]);