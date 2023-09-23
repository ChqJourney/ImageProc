<script>
  import { closeModal, guiStore } from "./store";
  import { _ } from "svelte-i18n";
  import Modal from "./lib/Modal.svelte";
  import Viewer from "./pages/Viewer.svelte";
  let osh, osw;
  let currentPage=Viewer;
  let compProps = { osh: osh, osw: osw };
</script>

<svelte:window class="" bind:innerHeight={osh} bind:innerWidth={osw} />
<Modal
  width={"w-2/3"} data={""}
  on:negitive={() => closeModal()}
  isOpen={$guiStore.modalShow}
  component={$guiStore.modalComponent}
/>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:contextmenu={(e) => e.preventDefault()}
  style="border-radius: 8px;"
  class={`relative flex flex-col items-center justify-center h-screen py-10 px-8 bg-gray-50 dark:bg-gray-600 `}
>
  <svelte:component on:switch_page={e=>{currentPage=e.detail.page}} this={currentPage} {...compProps} />
  
</div>
