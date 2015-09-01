/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( editor.config.getKey( 'ui/sidebar/geometry/collapsed' ) );
	container.onCollapsedChange( function ( boolean ) {

		editor.config.setKey( 'ui/sidebar/geometry/collapsed', boolean );

	} );
	container.setDisplay( 'none' );

	var geometryType = new UI.Text().setTextTransform( 'uppercase' );
	container.addStatic( geometryType );

	// Actions

	var objectActions = new UI.Select().setPosition('absolute').setRight( '8px' ).setFontSize( '11px' );
	objectActions.setOptions( {

		'Actions': 'Actions',
		'Center': 'Center',
		'Flatten': 'Flatten'

	} );
	objectActions.onClick( function ( event ) {

		event.stopPropagation(); // Avoid panel collapsing

	} );
	objectActions.onChange( function ( event ) {

		var action = this.getValue();

		var object = editor.selected;
		var geometry = object.geometry;

		if ( confirm( action + ' ' + object.name + '?' ) === false ) return;

		switch ( action ) {

			case 'Center':

				var offset = geometry.center();

				var newPosition = object.position.clone();
				newPosition.sub( offset );
				editor.execute( new CmdSetPosition( object, newPosition ) );

				editor.signals.geometryChanged.dispatch( object );
				editor.signals.objectChanged.dispatch( object );

				break;

			case 'Flatten':

				var newGeometry = geometry.clone();
				newGeometry.uuid = geometry.uuid;
				newGeometry.applyMatrix( object.matrix );

				var cmds = [ new CmdSetGeometry( object, newGeometry ),
					new CmdSetPosition( object, new THREE.Vector3( 0, 0, 0 ) ),
					new CmdSetRotation( object, new THREE.Euler( 0, 0, 0 ) ),
					new CmdSetScale( object, new THREE.Vector3( 1, 1, 1 ) ) ];

				editor.execute( new CmdMultiCmds( cmds ) );

				editor.signals.geometryChanged.dispatch( object );
				editor.signals.objectChanged.dispatch( object );

				break;

		}

		this.setValue( 'Actions' );

		signals.objectChanged.dispatch( object );

	} );
	container.addStatic( objectActions );

	container.add( new UI.Break() );

	// uuid

	var geometryUUIDRow = new UI.Panel();
	var geometryUUID = new UI.Input().setWidth( '115px' ).setFontSize( '12px' ).setDisabled( true );
	var geometryUUIDRenew = new UI.Button( '⟳' ).setMarginLeft( '7px' ).onClick( function () {

		geometryUUID.setValue( THREE.Math.generateUUID() );

		editor.execute( new CmdSetGeometryValue( editor.selected, 'uuid', geometryUUID.getValue() ) );

	} );

	geometryUUIDRow.add( new UI.Text( 'UUID' ).setWidth( '90px' ) );
	geometryUUIDRow.add( geometryUUID );
	geometryUUIDRow.add( geometryUUIDRenew );

	container.add( geometryUUIDRow );

	// name

	var geometryNameRow = new UI.Panel();
	var geometryName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new CmdSetGeometryValue( editor.selected, 'name', geometryName.getValue() ) );

	} );

	geometryNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	geometryNameRow.add( geometryName );

	container.add( geometryNameRow );

	// geometry

	container.add( new Sidebar.Geometry.Geometry( editor ) );

	// buffergeometry

	container.add( new Sidebar.Geometry.BufferGeometry( editor ) );

	// parameters

	var parameters = new UI.Panel();
	container.add( parameters );


	//

	function build() {

		var object = editor.selected;

		if ( object && object.geometry ) {

			var geometry = object.geometry;

			container.setDisplay( 'block' );

			geometryType.setValue( geometry.type );

			geometryUUID.setValue( geometry.uuid );
			geometryName.setValue( geometry.name );

			//

			parameters.clear();

			if ( geometry.type === 'BufferGeometry' || geometry.type === 'Geometry' ) {

				parameters.add( new Sidebar.Geometry.Modifiers( editor, object ) );

			} else if ( Sidebar.Geometry[ geometry.type ] !== undefined ) {

				parameters.add( new Sidebar.Geometry[ geometry.type ]( editor, object ) );

			}

		} else {

			container.setDisplay( 'none' );

		}

	}

	signals.objectSelected.add( build );
	signals.geometryChanged.add( build );
	signals.updateSidebar.add( build );

	return container;

}
