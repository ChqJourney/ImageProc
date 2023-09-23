<script>
    import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
  import { onMount,createEventDispatcher } from "svelte";
  import { listen } from "@tauri-apps/api/event";
  import WinBtns from "../lib/winBtns.svelte";
  import Brand from "../lib/svgs/Brand.svelte";
  import TopBar from "../lib/TopBar.svelte";
  import ToolBar from "../lib/ToolBar.svelte";
  import { clearImage, dataStore, guiStore, imageStore, resetRotation, updateData, updateImage } from "../store";
  import { dragHandling, fileName } from "../funcs/file";
  import { _ } from "svelte-i18n";
    import { openFile, openFolder } from "../funcs/biz";
    import { type } from "@tauri-apps/api/os";
    import Processor from "./Processor.svelte";
    import Viewer from "./Viewer.svelte";
    import wechat from "../lib/svgs/wechat.jpg"
    import { fitSize } from "../funcs/image";

  const dispatch = createEventDispatcher();
    let panning=false;
    let selectRec;
    let isUnderSelect;
  let isDragHover = false;
  let w, h;
  let imgStartP={x:0,y:0};
  let img;
  export let osh, osw;
  let start = { x: 0, y: 0 };
  let end={x:0,y:0}
  $:console.log(start,end)
  $:console.log(panning)
  
  listen("openFile-menu-clicked",async()=>await openFile());
    listen("openFolder-menu-clicked",async()=>await openFolder());
    listen("close-menu-clicked",()=>clearImage())
  
  onMount(async () => {
    $guiStore.os=await type()
    
    const path = await invoke("init_file");
    
    if (path) {
      console.log(path)
      const re=await dragHandling(path);
      if(re){

        updateData({
          mode: re.mode,
          source: [
            ...re.source
          ]
        });
      }
    }
    const unlisten = await listen("tauri://file-drop", async (event) => {
      
        const result = await dragHandling(event.payload[0]);
        if(!result){
          isDragHover = false;
          return;
        }
        resetRotation();
        updateData({
          mode: result.mode,
          source: [...result.source]
        });
        isDragHover = false;
      
    });
    await listen("tauri://file-drop-hover", async (event) => {
      isDragHover = true;
    });
    await listen("tauri://file-drop-cancelled", (e) => {
      isDragHover = false;
    });
  });
  let transform;
  $: {
    if (img) {
      transform =
        "translate(" +
        $imageStore.pointX +
        "px, " +
        $imageStore.pointY +
        "px) scaleX(" +
        $imageStore.scaleX +
        ") scaleY(" +
        $imageStore.scaleY +
        ")" +
        "rotate(" +
        $imageStore.rotation +
        "deg)";
      console.log(transform);
    }
  }
</script>



<TopBar>
    <Brand color="fill-[#0EA5E9]" width="w-20" height="h-10" />

    <div class="flex items-center justify-center gap-4">
      <ToolBar
        {img}
        containerH={h}
        containerW={w}
      />
    </div>
    <button on:click={()=>dispatch("switch_page",{page:Viewer})}
    class="hover:bg-gray-500 dark:fill-slate-200 dark:hover:fill-sky-500 dark:hover:bg-gray-400 tooltip rounded-md p-1 hover:fill-white"
  >
    <svg
      class="h-5 w-5"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      ><path
        d="M928 144H96a32 32 0 0 0-32 32v672a32 32 0 0 0 32 32h478.08v-64h-105.6l233.6-259.52L768 611.84l41.28-48.64-89.6-75.52a32 32 0 0 0-44.48 2.88l-177.92 197.76-139.2-120.64a32 32 0 0 0-43.52 1.6L128 755.84V208h768v273.92h64V176a32 32 0 0 0-32-32zM338.56 635.84L454.4 736l-67.2 74.56 6.08 5.44H160z"
      /><path d="M448 384m-80 0a80 80 0 1 0 160 0 80 80 0 1 0-160 0Z" /><path
        d="M848 640h-64v112H672v64h112V928h64v-112H960v-64h-112V640z"
      /></svg
    >
  </button>
    <WinBtns />
  </TopBar>
  
  
 
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:dblclick={()=>{start={x:0,y:0};end={x:0,y:0}}}
    bind:clientWidth={w}
    bind:clientHeight={h}
    on:mousedown={e=>{
      e.preventDefault();
      panning=true;
      start={x:e.offsetX,y:e.offsetY};
      end={x:e.offsetX,y:e.offsetY}
      }} 
  on:mousemove={e=>{
    if(panning){
      end={x:e.offsetX,y:e.offsetY}
    }
  }}
  on:mouseup={(e)=>{
    e.preventDefault();
    panning=false;
    console.log("u")
  }}
    class={`w-full ${
      isDragHover
        ? "border border-dashed dark:border-sky-400 border-orange-500 rounded-md"
        : "border-t dark:border-0"
    } overflow-hidden h-full relative`}
  >
  <div>

    <img on:load={() => {
      console.log(w, h);
      const result = fitSize(img, w, h, 36);
      updateImage({
        scaleX: result.ratio,
        scaleY: result.ratio,
        pointX: result.offsetX,
        pointY: result.offsetY,
      })
      
    }} bind:this={img}
    class="absolute"  src={wechat} alt="img" style="max-width:1000%;transform:{transform}"/>
  </div>
  <div class="absolute z-50 border-dashed opacity-50 border bg-sky-300 border-red-500" style="top:{start.y}px;left:{start.x}px;width:{end.x-start.x}px;height:{end.y-start.y}px;" bind:this={selectRec}></div>
  </div>

    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    
