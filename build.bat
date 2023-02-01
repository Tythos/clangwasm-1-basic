@ECHO OFF
REM Transcription of Makefile for Windows
echo COMPILING main.c INTO main.o
clang -Ofast -std=c99 -target wasm32 -nostdinc -D__EMSCRIPTEN__ -D_LIBCPP_ABI_VERSION=2 -fvisibility=hidden -fno-builtin -fno-exceptions -fno-threadsafe-statics -MP -o main.o -c main.c
echo LINKING main.o INTO main.wasm
wasm-ld -no-entry -allow-undefined -import-memory -export=__wasm_call_ctors -export=malloc -export=free -export=main -export=square -o main.wasm main.o
echo OPTIMIZING main.wasm INTO main.min.wasm
wasm-opt --legalize-js-interface -g -O0 main.wasm -o main.min.wasm
