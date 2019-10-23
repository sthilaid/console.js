
class Console
{
    constructor()
    {
        this.history = []
        this.cmd = ""
    }
}

var consoleInstance = new Console()

function onConsoleKey(event)
{
    //alert(event.key)
    if (event.key == "Alt" || event.key == "Control" || event.key == "Shift")
        return
    
    if (event.key == "Enter") {
        if (consoleInstance.cmd != "") {
            consoleInstance.history.push(consoleInstance.cmd)
            consoleInstance.cmd = ""
        }
    } else if (event.key == "Backspace") {
        consoleInstance.cmd.substring(0, Math.max(consoleInstance.cmd.length-1, 0))
    } else {
        consoleInstance.cmd += event.key
    }
    refresh()
}

function refresh() {
    let fontSize = 12
    let canvas = document.getElementById("ConsoleCanvas")
    let context = canvas.getContext("2d")
    context.font = fontSize+"px Courier"
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    var y = fontSize
    console.log("**** dumping: "+consoleInstance.history)
    consoleInstance.history.forEach(h => {
        context.fillText(h, 0, y)
        y += fontSize + 2
        console.log(h)
    })
    context.fillText("> " + consoleInstance.cmd +"_", 0, y)
}

function main()
{
    let canvas = document.getElementById("ConsoleCanvas")
    if (canvas)
    {
        canvas.tabIndex = 1000
        canvas.addEventListener("keydown", onConsoleKey)
    }
}

main()
