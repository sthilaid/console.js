const bannerMessage = " *** Welcome to super console 0.01b ***"
const inputAnimDT = 1000
const prompt = "> "
const fontSize = 14
const heightPadding = 2

class Console
{
    constructor(evalFn = null)
    {
        this.regionStart = 0
        this.regionEnd = -1
        this.history = []
        this.results = []
        this.cmd = ""
        this.evalFn = evalFn
        this.inputAnimLastTime = 0
        this.inputAnimStr = ""
    }

    ensureValidRegion(val) {
        return Math.max(0, Math.min(val, this.cmd.length))
    }
    
    incRegionStart(amount) {
        if (this.regionEnd != -1) {
            this.regionStart = this.regionEnd
            this.regionEnd = -1
        } else {
            this.regionStart = this.ensureValidRegion(this.regionStart + amount)
        }
    }

    incRegionEnd(amount) {
        if (this.regionEnd == -1) {
            this.regionStart = this.ensureValidRegion(this.regionStart - (amount < 0 ? amount : 0))
            this.regionEnd = this.ensureValidRegion(this.regionStart + amount)
        } else {
            this.regionEnd = Math.max(0, Math.min(this.regionEnd + amount, this.cmd.length))
        }
    }

    addToCmd(key) {
        this.removeRegionFromCmd(false)
        this.cmd = (this.cmd.substring(0, this.regionStart)
                    + key
                    + this.cmd.substring(this.regionStart, this.cmd.length))
        ++this.regionStart
    }

    removeRegionFromCmd(shouldRemoveStart = false) {
        if (this.regionEnd == -1 && !shouldRemoveStart)
            return

        if (this.regionEnd == -1)
            this.regionEnd = this.ensureValidRegion(this.regionStart-1)
        
        let minRegion = Math.min(this.regionStart, this.regionEnd)
        let maxRegion = Math.max(this.regionStart, this.regionEnd)

        this.cmd = this.cmd.substring(0, minRegion) + this.cmd.substring(maxRegion, this.cmd.length)

        const regionDelta = maxRegion - minRegion
        if (this.regionStart > this.regionEnd)
            this.regionStart = Math.max(0, Math.min(this.regionStart - regionDelta, this.cmd.length))
        this.regionEnd = -1
    }

    evalCmd() {
        this.history.push(this.cmd)
        if (this.evalFn) {
            this.results.push(this.evalFn(this.cmd))
        } else {
            this.results.push([])
        }
        this.cmd = ""
        this.regionStart = 0
        this.regionEnd = -1
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

        const textHeightDelta = fontSize + heightPadding
        
        context.fillStyle = "green"
        var y = fontSize
        context.fillText(bannerMessage, 0, y)
        y += textHeightDelta * 2 // add empty line

        for(var i=0; i<this.history.length; ++i) {
            context.fillText(prompt + this.history[i], 0, y)
            y += textHeightDelta
            if (Array.isArray(this.results[i])) {
                this.results[i].forEach(result => {
                    context.fillText(r, 0, y)
                    y += textHeightDelta
                })
            } else if (this.results[i] != "") {
                context.fillText(this.results[i], 0, y)
                y += textHeightDelta
            }
        }
        const isRegionActive = this.cmd.length > 0 && (this.regionStart != this.cmd.length || this.regionEnd != -1)
        
        
        if (isRegionActive) {
            const regionEndValid = this.regionEnd != -1
            const start = regionEndValid ? Math.min(this.regionStart, this.regionEnd) : this.regionStart
            const end = regionEndValid ? Math.max(this.regionStart, this.regionEnd) : this.regionStart+1
            const prefix = prompt + this.cmd.substring(0, start)
            const region = this.cmd.substring(start, end)
            const postfix= this.cmd.substring(end, this.cmd.length)
            let x = 0
            //console.log("start: "+start+" end: "+end)
            context.fillText(prefix, x, y)
            x += context.measureText(prefix).width

            const regionWidth = context.measureText(region).width
            if (regionEndValid) {
                context.fillStyle = "red"
                context.fillRect(x, y, regionWidth, -fontSize)
            }
            context.fillStyle = "yellow"
            context.fillText(region, x, y)
            x += regionWidth

            context.fillStyle = "green"
            context.fillText(postfix, x, y)
        }
        else {
            //console.log("start: "+this.regionStart+" end: "+this.regionEnd)
            context.fillText(prompt + this.cmd +this.inputAnimStr, 0, y)
        }
        y += textHeightDelta
    }

    step(time) {
        let shouldChangeState = time - this.inputAnimLastTime > inputAnimDT
        if (shouldChangeState) {
            this.inputAnimStr = this.inputAnimStr == "" ? "_" : ""
            this.inputAnimLastTime = time
            this.refresh()
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

    if (event.ctrlKey) {
        if (event.key == "e")
            consoleInstance.incRegionStart(99999999)
        else if (event.key == "a")
            consoleInstance.incRegionStart(-99999999)
        else if (event.key == "f")
            consoleInstance.incRegionStart(1)
        else if (event.key == "b")
            consoleInstance.incRegionStart(-1)
    }

    else if (event.shiftKey) {
        if (event.key == "ArrowRight") {
            consoleInstance.incRegionEnd(1)
        } else if (event.key == "ArrowLeft") {
            consoleInstance.incRegionEnd(-1)
        }
    }
    
    else if (event.key == "Enter") {
        consoleInstance.evalCmd()
    } else if (event.key == "Backspace") {
        consoleInstance.removeRegionFromCmd(true)
        //consoleInstance.cmd = consoleInstance.cmd.substring(0, Math.max(consoleInstance.cmd.length-1, 0))
    } else if (event.key == "ArrowRight") {
        consoleInstance.incRegionStart(1)
    } else if (event.key == "ArrowLeft") {
        consoleInstance.incRegionStart(-1)
    } else if (event.key.length == 1 && !event.ctrlKey && !event.altKey) {
        //consoleInstance.cmd += event.key
        consoleInstance.addToCmd(event.key)
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
