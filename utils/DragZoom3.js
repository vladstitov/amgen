/**
 * Created by Vlad on 8/12/2015.
 */
if ( !window.requestAnimationFrame ) {

    window.requestAnimationFrame = ( function() {

        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                window.setTimeout( callback, 1000 / 60 );

            };

    } )();

}

/**
 * @author Hans Eklund, North Kingdom
 */

var input = {dragStartX:0, dragStartY:0, dragX:0, dragY:0, dragDX:0, dragDY:0, dragging:false, touchStartDistance:0, touchStartAngle:0};
var Matrix = {a:1,b:0,c:0,d:1,tx:0,ty:0};
var viewPort;
var building;
var prefixedTransform;
var currentScale = 1.0;
var currentRotation = 0;
var posX = 0;
var posY = 0;
var velocityX = 0;
var velocityY = 0;
var containerWidth= 1000;
var containerHeight= 1000;
var plateWidth = 1000;
var plateHeight = 1000;
var maxScale = 9.5;
var minScale = 0.5;
var tr
var st
function initDragZoom() {

    viewPort = document.getElementById('ViewPort');
    building = document.getElementById('Building');

    if('transform' in document.body.style){
        prefixedTransform='transform';
    }else if('webkitTransform' in document.body.style){
        prefixedTransform='webkitTransform';
    }
    // listeners
    if (window.PointerEvent) {
        input.pointers=[];
        viewPort.addEventListener("pointerdown", pointerDownHandler, false);
    }else{
        viewPort.addEventListener('touchstart', onTouchStart);
        viewPort.addEventListener('mousedown', onPlateMouseDown);
    }
    posX=containerWidth*0.5;
    posY=containerHeight*0.5;

    building.style[prefixedTransform]= 'translate(0,0) rotate(10deg) scale(1.5) translateZ(0)';

   st = window.getComputedStyle(building, null);
console.log(prefixedTransform);

    tr = st.getPropertyValue(prefixedTransform) ;//|| st.getPropertyValue("-moz-transform") ||  st.getPropertyValue("-ms-transform") || st.getPropertyValue("-o-transform") ||  st.getPropertyValue("transform");
console.log(tr);
    onAnimationFrame();

};


function cFPS(){
    var now = new Date().getTime();
    var fps = 1000/(now-last);
    total+=fps;
    last=now;
    count++
    if(count==30){
        count=0;
        $('#FPS').text((total/30).toFixed())
        total=0;

    }
}

var last = new Date().getTime();
var t60=0;
var count=0;
var total=0;

function matrixToArray(str) {
    return str.split('(')[1].split(')')[0].split(',');
}


function onAnimationFrame() {
   cFPS();

   // console.log(tr);
    requestAnimationFrame( onAnimationFrame );

    if(input.dragDX !== 0) velocityX = input.dragDX;
    if(input.dragDY !== 0) velocityY = input.dragDY;

    posX+= velocityX;
    posY+= velocityY;

    //restict horizontally
    if(posX<0) posX=0;
    else if(posX>containerWidth) posX=containerWidth;

    //restict vertically
    if(posY<0) posY=0;
    else if(posY>containerHeight) posY=containerHeight;
/*
    currentRotation=currentRotation/100;
    var d = currentRotation-matr.ang;
    ///  console.log('rotate '+(d));

    var sc= currentScale/matr.sc;
    matr.sc = currentScale;

    var a= d*Math.PI;
    var cos = Math.cos(a);
    var sin= Math.sin(a);
    var a1 = matr.a;
    var b1 = matr.b;
    matr.a = (a1*cos+matr.c*sin)*sc;
    matr.b = (b1*cos+matr.d*sin)*sc;
    matr.c = (-a1*sin+matr.c*cos)*sc;
    matr.d = (-b1*sin+matr.d*cos)*sc;
    matr.ang=currentRotation;

   /*
var sc = currentScale;
    var x=sc/matr.sc;
    var y=x;
    matr.a *= x;
    matr.b *= x;
    matr.c *= y;
    matr.d *= y;
    // m.tx *= x;
    // m.ty *= y;
    matr.sc=sc;
    */
    //set the transform
   viewPort.style[prefixedTransform]= 'translate('+posX+'px,'+posY+'px) rotate(0) scale(1) translateZ(0)';
   // viewPort.style[prefixedTransform]= 'translate('+500+'px,'+500+'px) rotate(0) scale(1) translateZ(0)';

    //  console.log(ar);
  //  this.view.css('transform','matrix('+ar+')');
   // building.style['transform'] = matr.get();
   building.style[prefixedTransform]= 'translate(0,0) rotate('+currentRotation+'deg) scale('+currentScale+') translateZ(0)';
    var ar= matrixToArray(st.getPropertyValue(prefixedTransform));
  ///  console.log();
//console.log(building.style.getPropertyValue(''));


   // building.style[prefixedTransform]= 'matrix();';

    velocityX= velocityX*0.8;
    velocityY= velocityY*0.8;

    input.dragDX=0;
    input.dragDY=0;

}


/*
 * Events
 */

function onPlateMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('mousemove', onDocumentMouseMove);
    if(event.shiftKey === true) {
        //assume second touchpoint is in middle of screen
        handleGestureStart(posX, posY, event.clientX, event.clientY);
    } else {
        handleGestureStop();
        handleDragStart(event.clientX, event.clientY);
    }
}

function onDocumentMouseMove(event) {
    if(event.shiftKey) {
        handleGesture(posX, posY, event.clientX, event.clientY);
    } else {
        handleDragging(event.clientX, event.clientY);
    }

}

function onDocumentMouseUp(event) {
    document.removeEventListener('mouseup', onDocumentMouseUp);
    document.removeEventListener('mousemove', onDocumentMouseMove);

    handleGestureStop();

    event.preventDefault();
    handleDragStop();
}

function onTouchStart(event) {
    event.preventDefault();
    if( event.touches.length === 1){
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
        document.addEventListener('touchcancel', onTouchEnd);
        handleDragStart(event.touches[0].clientX , event.touches[0].clientY);
    }else if( event.touches.length === 2 ){
        handleGestureStart(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY );
    }
}

function onTouchMove(event) {
    event.preventDefault();
    if( event.touches.length  === 1){
        handleDragging(event.touches[0].clientX, event.touches[0].clientY);
    }else if( event.touches.length === 2 ){
        handleGesture(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY );
    }
}

function onTouchEnd(event) {
    event.preventDefault();
    if( event.touches.length  === 0 && input.dragging){
        handleDragStop();
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        document.removeEventListener('touchcancel', onTouchEnd);
    }else if(event.touches.length === 1 ){
        handleGestureStop();
        handleDragStart(event.touches[0].clientX, event.touches[0].clientY);
    }
}
function indexOfPointer(pointerId){
    for (var i=0;i<input.pointers.length;i++){
        if(input.pointers[i].pointerId === pointerId) {
            return i;
        }
    }
    return -1;
}
function pointerDownHandler(event) {
    var pointerIndex=indexOfPointer(event.pointerId);
    if(pointerIndex<0){
        input.pointers.push(event);
    }else{
        input.pointers[pointerIndex] = event;
    }
    if( input.pointers.length === 1){
        handleDragStart(input.pointers[0].clientX , input.pointers[0].clientY);
        window.addEventListener("pointermove", pointerMoveHandler, false);
        window.addEventListener("pointerup", pointerUpHandler, false);
    }else if( input.pointers.length === 2 ){
        handleGestureStart(input.pointers[0].clientX, input.pointers[0].clientY, input.pointers[1].clientX, input.pointers[1].clientY );
    }
}

function pointerMoveHandler(event) {
    var pointerIndex=indexOfPointer(event.pointerId);
    if(pointerIndex<0){
        input.pointers.push(event);
    }else{
        input.pointers[pointerIndex] = event;
    }

    if( input.pointers.length  === 1){
        handleDragging(input.pointers[0].clientX, input.pointers[0].clientY);
    }else if( input.pointers.length === 2 ){
        console.log(input.pointers[0], input.pointers[1]);
        handleGesture(input.pointers[0].clientX, input.pointers[0].clientY, input.pointers[1].clientX, input.pointers[1].clientY );
    }
}

function pointerUpHandler(event) {
    var pointerIndex=indexOfPointer(event.pointerId);
    if(pointerIndex<0){

    }else{
        input.pointers.splice(pointerIndex,1);
    }

    if( input.pointers.length  === 0 && input.dragging){
        handleDragStop();
        window.removeEventListener("pointermove", pointerMoveHandler, false);
        window.removeEventListener("pointerup", pointerUpHandler, false);
    }else if(input.pointers.length === 1 ){
        handleGestureStop();
        handleDragStart(input.pointers[0].clientX, input.pointers[0].clientY);
    }

}
function handleDragStart(x ,y ){
    input.dragging = true;
    input.dragStartX = input.dragX = x;
    input.dragStartY = input.dragY = y;
}

function handleDragging(x ,y ){
    if(input.dragging) {
        input.dragDX = x-input.dragX;
        input.dragDY = y-input.dragY;
        input.dragX = x;
        input.dragY = y;
    }
}

function handleDragStop(){
    if(input.dragging) {
        input.dragging = false;
        input.dragDX=0;
        input.dragDY=0;
    }
}
function handleGestureStart(x1, y1, x2, y2){
    input.isGesture = true;
    //calculate distance and angle between fingers
    var dx = x2 - x1;
    var dy = y2 - y1;
    input.touchStartDistance=Math.sqrt(dx*dx+dy*dy);
    input.touchStartAngle=Math.atan2(dy,dx);
    //we also store the current scale and rotation of the actual object we are affecting. This is needed because to enable incremental rotation/scaling.
    input.startScale=currentScale;
    input.startAngle=currentRotation;
}

var touchDistancePrev=0;
var touchAnglePrev=0;
function handleGesture(x1, y1, x2, y2){
    if(input.isGesture){
        //calculate distance and angle between fingers
        var dx = x2 - x1;
        var dy = y2 - y1;
        var touchDistance=Math.sqrt(dx*dx+dy*dy);


        var touchAngle=Math.atan2(dy,dx);
        //calculate the difference between current touch values and the start values
        var scalePixelChange = touchDistance - input.touchStartDistance;
        var d1=Math.abs(touchDistancePrev-scalePixelChange);

       // console.log(d1);
       if(d1>3){
           currentScale=input.startScale + (scalePixelChange*0.005);
            touchDistancePrev=scalePixelChange;

       }

        var angleChange = touchAngle - input.touchStartAngle;
        var d2= Math.abs(touchAnglePrev-angleChange);
        //console.log(d2);
        if(d2>0.05){
            touchAnglePrev=angleChange
            currentRotation=input.startAngle+(angleChange*180/Math.PI);
        }
      //  console.log(scalePixelChange);
        //calculate how much this should affect the actual object



        if(currentScale<minScale) currentScale=minScale;
        if(currentScale>maxScale) currentScale=maxScale;
    }
}
function handleGestureStop(){
    input.isGesture= false;
}