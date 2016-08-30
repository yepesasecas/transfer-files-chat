// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"
import lineNavigator from "line-navigator"


socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("rooms:lobby", {})
let chatInput = $("#chat-input")

chatInput.on("keypress", event => {
  if(event.keyCode === 13){
    channel.push("new_chat_msg", {body: chatInput.val()})
    chatInput.val("")
  }
})

channel.on("new_chat_msg", payload => {
  $("#messages").append(`<br\>${payload.body}`)
})

channel.on("new_file_line", payload => {
  $("#file-container").prepend(`<br\>${payload.body}`)
})

channel.on("progress", payload => {
  $("#progress").text(payload.body)
})

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })


$("#file").change( ()=> {
  console.log("cambio!!!");
  let file = $("#file")[0].files[0]
  let navigator = new lineNavigator(file)
  console.log(navigator);
  navigator.readSomeLines(0, function linesReadHandler(err, index, lines, isEof  , progress){
    if (err) throw err;

    // Reading lines
    for (var i = 0; i < lines.length; i++) {
        var lineIndex = index + i;
        var line = lines[i];

        // Do something with line
        channel.push("new_file_line", {body: line})
    }

    // progress is a position of the last read line as % from whole file length;
    channel.push("progress", {body: "PROGRESS " + progress + "%"})

    // End of file
    if (isEof) return;

    // Reading next chunk, adding number of lines read to first line in current chunk
    navigator.readSomeLines(index + lines.length, linesReadHandler);
  })
})
