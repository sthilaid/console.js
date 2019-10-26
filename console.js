
const inputAnimDT = 1000
const prompt = "> "
const fontSize = 14
const heightPadding = 2

class Console
{
    constructor(evalFn = null)
    {
        this.history = []
        this.results = []
        this.cmd = ""
        this.evalFn = evalFn
        this.inputAnimLastTime = 0
        this.inputAnimStr = ""
    }

    evalCmd() {
        this.history.push(this.cmd)
        if (this.evalFn) {
            this.results.push(this.evalFn(this.cmd))
        } else {
            this.results.push([])
        }
        this.cmd = ""
    }

    refresh() {
        if (!canvas || !context)
            return

        if (this.history.length != this.results.length) {
            alert("history and results length should match ("
                  +this.history.length+" != "+this.results.length+")")
            return
        }
        
        context.font = fontSize+"px Courier"
        context.fillStyle = "black"
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.fillStyle = "green"
        var y = fontSize
        context.fillText(" *** Welcome to super console 0.01b ***\n", 0, y)
        y += fontSize*2

        for(var i=0; i<this.history.length; ++i) {
            context.fillText(prompt + this.history[i], 0, y)
            y += fontSize + heightPadding
            if (Array.isArray(this.results[i])) {
                this.results[i].forEach(result => {
                    context.fillText(r, 0, y)
                    y += fontSize + heightPadding
                })
            } else if (this.results[i] != "") {
                context.fillText(this.results[i], 0, y)
                y += fontSize + heightPadding
            }
        }
        
        context.fillText(prompt + this.cmd +this.inputAnimStr, 0, y)
        y += fontSize + heightPadding
    }

    step(time) {
        let shouldChangeState = time - this.inputAnimLastTime > inputAnimDT
        if (shouldChangeState) {
            this.inputAnimStr = this.inputAnimStr == "" ? "_" : ""
            this.inputAnimLastTime = time
            this.refresh()
            console.log("refreshing: "+this.inputAnimStr)
        }
        let obj = this
        window.requestAnimationFrame(function(t){obj.step(t)})
    }
}

function onConsoleKey(event)
{
    //console.log(event.key)
    if (event.key == "Alt" || event.key == "Control" || event.key == "Shift")
        return
    
    if (event.key == "Enter") {
        consoleInstance.evalCmd()
    } else if (event.key == "Backspace") {
        consoleInstance.cmd = consoleInstance.cmd.substring(0, Math.max(consoleInstance.cmd.length-1, 0))
    } else if (event.key.length == 1){
        consoleInstance.cmd += event.key
    }
    consoleInstance.refresh()
}

var consoleInstance = null
var canvas          = null
var context         = null

function main()
{
    var x=0
    consoleInstance = new Console(function(cmd){return "["+(x++)+"] "+cmd})
    canvas = document.getElementById("ConsoleCanvas")
    if (canvas)
    {
        context = canvas.getContext("2d")
        
        canvas.tabIndex = 1
        canvas.focus()
        canvas.addEventListener("keydown", onConsoleKey)
        consoleInstance.refresh()
        window.requestAnimationFrame(function(step){consoleInstance.step(step)})
    }
}

main()
