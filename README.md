# ClangWasm

## 1. Basic

This is a transcription of @bschilling's outstanding *ClangWasm* project, which was originally documented in detail on his web page:

  https://schellcode.github.io/webassembly-without-emscripten

For this (hard) fork, we have extracted the *basic* program and made the following modifications:

* The Makefile has been replaced by a greatly streamlined `build.bat` for Windows execution, which assumes relevant executables (`clang`, `wasm-ld`, `wasm-opt`) exist on the system path

* The built-in `.WASM` has been removed, and all `.O` and `.WASM` artifacts added to the new `.gitignore`

* A stylesheet has been broken out from the styles formerly built into primary "loader" HTML

* The loader page (main.html) has been refactored to minimize required HTML and use the new module

* The JavaScript has been reorganized into an ES6 module, main.mjs, which performs the requisite actions on window load using a module-level WASM specification that points at the "main.min.wasm" file

* The build process differentiates between "main.wasm", the initial output of the linking action, and "main.min.wasm", the minimized output of the "wasm-opt" optimization call

* This README has been consolidated and extended

## A Note About Dependencies

You can install modern LLVM quite readily on Windows using the pre-built binary packages available from the release pages:

  https://github.com/llvm/llvm-project/releases/

This will give you `clang` and `wasm-ld` out of the box.

If you directly clone the <WebAssembly/binaryen> project, you can use cmake to build `wasm-opt.exe` without any issues. Simply adding the resulting "bin" folder to your system path should be sufficient for `build.bat` to run.
