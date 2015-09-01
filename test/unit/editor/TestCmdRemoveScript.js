module("CmdRemoveScript");

test( "Test CmdRemoveScript (Undo and Redo)", function() {

	var editor = new Editor();

	// prepare
	var box    = aBox( "The scripted box" );
	var sphere = aSphere( "The scripted sphere" );
	var objects = [ box, sphere ];

	var xMove  = { name: "", source: "function update( event ) { this.position.x = this.position.x + 1; }" };
	var yMove  = { name: "", source: "function update( event ) { this.position.y = this.position.y + 1; }" };
	var scripts = [ xMove, yMove ];

	// add objects to editor
	objects.map( function( item ) {
		editor.execute( new CmdAddObject( item ) );
	});
	ok( editor.scene.children.length == 2, "OK, the box and the sphere have been added" );

	// add scripts to the objects
	for ( var i = 0; i < scripts.length; i++ ) {

		var cmd = new CmdAddScript( objects[i], scripts[i] );
		cmd.updatable = false;
		editor.execute( cmd );

	}

	for ( var i = 0; i < scripts.length; i++ ) {

		var cmd = new CmdRemoveScript( objects[i], scripts[i] );
		cmd.updatable = false;
		editor.execute( cmd );

	}
	ok( getScriptCount( editor ) == 0, "OK, all scripts have been removed" );

	scripts.map( function() {
		editor.undo();
	});
	ok( getScriptCount( editor ) == scripts.length, "OK, all scripts have been added again by undo(s)" );

	var scriptsKeys = Object.keys( editor.scripts );
	for (var i = 0; i < scriptsKeys.length; i++ ) {

		ok( editor.scripts[ scriptsKeys[i] ][0] == scripts[i], "OK, script #" + i + " is still assigned correctly" );

	}

	editor.redo();
	ok( getScriptCount( editor ) == scripts.length - 1, "OK, one script has been removed again by redo" );

});