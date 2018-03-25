//Function to define the relationship between various organelles.  These
//relationships define the path that vesicles will travel along

function Relationships(sendList){
  this.sendList = sendList;

  this.sendVesicles = function(){

    //Loop through each object this Organelle sends vesicles to
    for (i = 0; i < this.sendList.length; i++) {

      //if the scene.frameCount is divisable by the frequency rate specified
      //for that relationship then release the vesicle
      if (scene.frameCount % sendList[i].frequency == 0){
        var vesicle = new Vesicle(
          sendList[i].releaseObj,
          sendList[i].targetObj,
          sendList[i].speed,
          sendList[i].color,
          sendList[i].radius,
          sendList[i].arc
        );
      }
    }
  };

  this.update = function() {
    this.sendVesicles();
  };
}
