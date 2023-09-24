<script>
  import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
  import { onMount, createEventDispatcher } from "svelte";
  import { listen } from "@tauri-apps/api/event";
  import WinBtns from "../lib/winBtns.svelte";
  import Brand from "../lib/svgs/Brand.svelte";
  import TopBar from "../lib/TopBar.svelte";
  import ToolBar from "../lib/ToolBar.svelte";
  import {
    clearImage,
    dataStore,
    guiStore,
    imageStore,
    resetRotation,
    updateData,
    updateImage,
  } from "../store";
  import { dragHandling, fileName } from "../funcs/file";
  import { _ } from "svelte-i18n";
  import { openFile, openFolder } from "../funcs/biz";
  import { type } from "@tauri-apps/api/os";
  import Processor from "./Processor.svelte";
  import Viewer from "./Viewer.svelte";
  import wechat from "../lib/svgs/wechat.jpg";
  import { fitSize } from "../funcs/image";
    import { fitCanvasSize } from "../funcs/canvas";
    import EditBar from "../lib/EditBar.svelte";

  const dispatch = createEventDispatcher();
  let isUnderPanning = false;
  let isUnderSelect=false;
  let under=false;
  let selectRec;
  let isDragHover = false;
  let w, h;
  let imgStartP = { x: 0, y: 0 };
  let newImage;
  let canvas;
  let ctx;
  export let osh, osw;
  let start = { x: 0, y: 0 };
  let end = { x: 0, y: 0 };
  let startPan={x:0,y:0}
  let endPan={x:0,y:0}
  $: console.log(start, end);
let currentX=0, currentY=0;
  const refreshCanvas=()=>{
    requestAnimationFrame(refreshCanvas)
    // ctx.reset()
    newImage = new Image();
    newImage.src = $dataStore.source[$dataStore.currentIdx].url;
    
    ctx = canvas.getContext("2d");
    const result = fitCanvasSize(newImage,w,h)
    console.log(result)
    newImage.onload = () => {
      ctx.drawImage(newImage, currentX, currentY);
    };
  }
  onMount(async () => {
    console.log(window)
    $guiStore.os = await type();
    ctx = canvas.getContext("2d");
    newImage = new Image();
    newImage.src = $dataStore.source[$dataStore.currentIdx].url;
    // newImage.style.transform =
    //   "scaleX(" + $imageStore.scaleX + ") scaleY(" + $imageStore.scaleY + ")";
    // console.log(newImage.style.transform);
    const result = fitCanvasSize(newImage,w,h)
    console.log(result)
    newImage.onload = () => {
      ctx.drawImage(newImage, currentX, currentY);
    };
  });
</script>

<TopBar>
  <Brand color="fill-[#0EA5E9]" width="w-20" height="h-10" />

  <div class="flex items-center justify-center gap-4">
    <button
      on:click={() => dispatch("switch_page", { page: Viewer })}
      class="hover:bg-gray-500 dark:fill-orange-600 dark:hover:fill-orange-800 dark:hover:bg-teal-400 dark:bg-teal-200 tooltip rounded-md p-1 hover:fill-white"
    >
      <svg
        class="h-5 w-5"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
        ><path
          d="M938.666667 490.666667v42.666666a21.333333 21.333333 0 0 1-21.333334 21.333334H227.413333l189.866667 189.44a21.333333 21.333333 0 0 1 0 30.293333l-30.293333 29.866667a21.333333 21.333333 0 0 1-30.293334 0l-261.973333-261.546667a32 32 0 0 1-9.386667-22.613333v-16.213334a32.853333 32.853333 0 0 1 9.386667-22.613333l261.973333-261.546667a21.333333 21.333333 0 0 1 30.293334 0l30.293333 30.293334a20.906667 20.906667 0 0 1 0 29.866666L227.413333 469.333333H917.333333a21.333333 21.333333 0 0 1 21.333334 21.333334z"
        /></svg
      >
    </button>
    <EditBar 
    on:pan={()=>{
      isUnderPanning=!isUnderPanning
    }}
    on:select={()=>{
      isUnderSelect=!isUnderSelect
    }}
    />
  </div>

  <WinBtns />
</TopBar>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:dblclick={() => {
    start = { x: 0, y: 0 };
    end = { x: 0, y: 0 };
  }}
  
  bind:clientWidth={w}
  bind:clientHeight={h}
  
  class={`w-full h-full ${isUnderPanning?" cursor-move":""}  flex justify-center items-center overflow-hidden relative`}
>
  
    <canvas
    on:mousedown={(e)=>{
      under=true;
      if(isUnderSelect&&under){
  
        start={x:e.offsetX,y:e.offsetY}
        end={x:e.offsetX,y:e.offsetY}
      }
      if(isUnderPanning&&under){
        startPan={x:e.offsetX,y:e.offsetY}
        endPan={x:e.offsetX,y:e.offsetY}
      }
    }}
    on:mousemove={(e)=>{
      if(isUnderSelect&&under){
        end={x:e.offsetX,y:e.offsetY}
      }
      if(isUnderPanning&&under){
        console.log(under)
       currentX=e.offsetX;
       currentY=e.offsetY;
       ctx.clearRect(0,0,w,h)
       refreshCanvas()
      }
    }}
    on:mouseup|stopPropagation={(e)=>{
      under=false
    }}
    width={w-20} height={h-20} bind:this={canvas} />
  
  <div
    class="absolute z-50 border-dashed opacity-50 border bg-sky-300 border-red-500"
    style="top:{start.y}px;left:{start.x}px;width:{end.x -
      start.x}px;height:{end.y - start.y}px;"
    bind:this={selectRec}
  />
</div>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
