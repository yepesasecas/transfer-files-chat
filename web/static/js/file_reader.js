export var ReadFile = {
  read: function(file_path, channel){
    file_path.onchange = function(){

      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function(progressEvent){
        // By lines
        var lines = this.result.split('\n');
        for(var line = 0; line < lines.length; line++){
          channel.push("new_msg", {body: lines[line]})
        }
      };
      reader.readAsText(file);
    };
  }
}
