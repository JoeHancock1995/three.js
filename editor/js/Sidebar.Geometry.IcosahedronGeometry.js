/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.IcosahedronGeometry = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Panel();

	var parameters = object.geometry.parameters;

	// radius

	var radiusRow = new UI.Panel();
	var radius = new UI.Number( parameters.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// detail

	var detailRow = new UI.Panel();
	var detail = new UI.Integer( parameters.detail ).setRange( 0, Infinity ).onChange( update );

	detailRow.add( new UI.Text( 'Detail' ).setWidth( '90px' ) );
	detailRow.add( detail );

	container.add( detailRow );


	//

	function update() {

		editor.execute( new CmdSetGeometry( object, new THREE.IcosahedronGeometry(
			radius.getValue(),
			detail.getValue()
		) ) );

		signals.objectChanged.dispatch( object );

	}

	return container;

}
