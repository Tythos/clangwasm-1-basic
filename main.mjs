/**
 * 
 */

var WA = {
    "module": 'main.min.wasm',
    "print": function (text) {
        document.getElementById('wa_log').innerHTML += text.replace(/\n/g, "<br>");
    },
    "error": function (code, msg) {
        document.getElementById('wa_log').innerHTML += '<div style="text-align:center;background-color:#FFF;color:#000;padding:1.5em;width:540px;margin:2em auto">' + {
            BOOT: 'Error during startup. Your browser might not support WebAssembly. Please update it to the latest version.',
            CRASH: 'The program crashed.',
            MEM: 'The program ran out of memory.',
        }[code] + '<br><br>(' + msg + ')</div>';
    },
    "started": function () {
        WA.print('Started\n');
        WA.print('square(2): ' + WA.asm.square(2) + '\n');
        WA.print('square(3): ' + WA.asm.square(3) + '\n');
    }
};

function abort(code, msg) {
	WA.error(code, msg);
	throw 'abort';
}

function onModuleLoaded(wasmBytes) {
    'use strict';
    wasmBytes = new Uint8Array(wasmBytes);
    WA.print = WA.print || function (msg) { console.log(msg); };
    WA.error = WA.error || function (code, msg) { WA.print('[ERROR] ' + code + ': ' + msg + '\n'); };
    var wasmHeapBase = 65536;
    for (let i = 8, sectionEnd, type, length; i < wasmBytes.length; i = sectionEnd) {
        function Get() { return wasmBytes[i++]; }
        function GetLEB() { for (var s=i,r=0,n=128; n&128; i++) r|=((n=wasmBytes[i])&127)<<((i-s)*7); return r; }
        type = GetLEB(), length = GetLEB(), sectionEnd = i + length;
        if (type < 0 || type > 11 || length <= 0 || sectionEnd > wasmBytes.length) break;
        if (type == 6) {
            let count = GetLEB(), gtype = Get(), mutable = Get(), opcode = GetLEB(), offset = GetLEB(), endcode = GetLEB();
            wasmHeapBase = offset;
            break;
        }
    }
    var wasmMemInitial = ((wasmHeapBase+65535)>>16<<16) + (256 * 1024);
    var env = { memory: new WebAssembly.Memory({initial: wasmMemInitial>>16 }) };
    WebAssembly.instantiate(wasmBytes, {env:env})
        .then(function (output) {
            WA.asm = output.instance.exports;
            if (WA.asm.__wasm_call_ctors) WA.asm.__wasm_call_ctors();
            if (WA.asm.main) WA.asm.main(0, 0);
            if (WA.started) WA.started();
        })
        .catch(function (err) {
            if (err !== 'abort') abort('BOOT', 'WASM instiantate error: ' + err + (err.stack ? "\n" + err.stack : ''));
        });
}

function onSourceLoaded(text) {
    let pre = document.createElement("pre");
    pre.textContent = text;
    document.body.appendChild(pre);
}

function onWindowLoaded(event) {
    fetch(WA.module)
        .then(res => res.arrayBuffer())
        .then(onModuleLoaded);
    fetch("./main.c")
        .then(response => response.text())
        .then(onSourceLoaded);
}

window.addEventListener("load", onWindowLoaded);
