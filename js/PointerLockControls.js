/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

    var angle = 0.872664626;	//radianos aproximadamente 50 graus
	var upperAngle = angle;
	var lowerAngle = -angle;
    var turningSpeed = 0.002;


    var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        // Original
        // yawObject.rotation.y -= movementX * 0.002;
        // pitchObject.rotation.x -= movementY * 0.002;

        if ( movementX > 0 && yawObject.rotation.y > lowerAngle) {	// DIREITA (D)
            yawObject.rotation.y -= movementX * turningSpeed;

        } else if ( movementX < 0 && yawObject.rotation.y < upperAngle) {	// ESQUERDA (A)
            yawObject.rotation.y -= movementX * turningSpeed;
        }

        if ( movementY > 0 && pitchObject.rotation.x > -angle) {	// CIMA (W)
            pitchObject.rotation.x -= movementY * turningSpeed;

        } else if ( movementY < 0 && pitchObject.rotation.x < angle) {	// BAIXO (S)
            pitchObject.rotation.x -= movementY * turningSpeed;
        }



		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

    this.updatePosition = function () {

		upperAngle = yawObject.rotation.y + angle;
		lowerAngle = yawObject.rotation.y - angle;
    };

	this.dispose = function() {

		document.removeEventListener( 'mousemove', onMouseMove, false );

	};

	document.addEventListener( 'mousemove', onMouseMove, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		};

	}();

};
