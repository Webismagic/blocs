// Inject renderer
var r = document.createElement("iframe");
r.id = "makecoderenderer";
r.style.position = "absolute";
r.style.left = 0;
r.style.bottom = 0;
r.style.width = "1px";
r.style.height = "1px";
r.style.display = "none";
r.src = "https://makecode.microbit.org/--docs?render=1"
document.body.appendChild(r);

// Button state changes
function enableRenderButton() {
    btn = document.getElementById("render");
    btn.className = "btn-ready";
    btn.innerText = "Render";
    btn.disabled = false;
}

function disableRenderButton(text) {
    btn = document.getElementById("render");
    btn.className = "btn-working";
    btn.innerText = text;
    btn.disabled = true;
}

function disableDownloadButton(disabled){
    let btn = document.getElementById('download')
    btn.disabled = disabled
}

// Events
window.addEventListener("message", function (event) {
    var msg = event.data;
    if (msg.source != "makecode") return;

    console.log(msg.type)
    switch (msg.type) {
        case "renderready":
            // iframe is ready to receive render requests
            enableRenderButton();
            disableDownloadButton(true);
            break;

        case "renderblocks":
            var svg = msg.svg; // this is an string containing SVG
            var img = document.createElement("img");
            img.src = msg.uri;
            img.width = msg.width;
            img.height = msg.height;
            var preview = document.getElementById("preview");
            preview.innerHTML = "";
            preview.appendChild(img);
            enableRenderButton();
            disableDownloadButton(false)
            break;
    }
}, false);

// Button handlers
function render() {
    disableRenderButton("Rendering...");
    disableDownloadButton(true);

    r.contentWindow.postMessage({
        type: "renderblocks",
        id: "0",
        code: document.getElementById("code").value
    }, "https://makecode.microbit.org/");
};

function download() {
    var a = document.createElement("a");
    a.href = document.getElementById("preview").children[0].src;
    a.setAttribute("download", "microbit-render.svg");
    a.click();
  }
