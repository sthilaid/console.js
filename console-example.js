
function main()
{
    canvas = document.getElementById("ConsoleCanvas")
    if (canvas)
    {
        context = canvas.getContext("2d")

        var x=0
        consoleInstance = new Console(canvas, context, function(cmd){return "["+(x++)+"] "+cmd})
        
        consoleInstance.refresh()
        window.requestAnimationFrame(function(step){consoleInstance.step(step)})
    }
}

main()
