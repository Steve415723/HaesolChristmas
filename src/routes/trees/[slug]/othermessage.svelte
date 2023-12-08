<script lang="ts">
    import { popupEnabled } from "./stores"

    export let message: {id: string,name: string,content: string,index: number,rotate: number}
    export let isPublic: boolean

    let mainDiv: HTMLDivElement

    popupEnabled.subscribe((value) => {
        if (!mainDiv) return
        
        if (value != "othermessage") {
            mainDiv.style.display = `none`
            return
        }

        mainDiv.style.display = `block`
    })
</script>

<div id="othermessage-container" bind:this={mainDiv} style="display: none;">
    <div id="othermessage-popup">
        <div id="othermessage-title"><span style="color: var(--text-red);">{message?.name}</span>님의 메시지</div>
        <div id="othermessage-content">{isPublic ? message?.content : "트리에 달린 메시지는 12월 25일 0시에\n본인에게만 공개됩니다."}</div>
        <button style="margin-top: 30px;" on:click={() => {$popupEnabled = undefined}}>닫기</button>
    </div>
</div>

<style>
    #othermessage-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
    }

    #othermessage-popup {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 800px;
        height: 500px;
        max-width: 95vw;
        max-height: calc(95vw * 1.25);
        border-radius: 5px;
        background-image: url("https://cdn.pixabay.com/photo/2017/11/09/00/07/christmas-2932077_1280.jpg");
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #othermessage-popup::-webkit-scrollbar {
        background-color: black;
        width: 5px;
        border-radius: 2.5px;
    }

    #othermessage-popup::-webkit-scrollbar-thumb {
        background-color: var(--light-green);
        width: 5px;
        border-radius: 2.5px;
    }

    #othermessage-title {
        margin-top: 15px;
        color: var(--text-green);
        font-size: 25px;
    }

    #othermessage-content {
        margin-top: 25px;
        width: 90%;
        height: 50%;
        border-radius: 5px;
        border: 3px solid var(--border-red);
        font-size: 18px;
        padding: 5px;
        white-space: pre-line;
        overflow-y: auto;
    }

    #othermessage-content::-webkit-scrollbar {
        background-color: black;
        width: 5px;
        border-radius: 2.5px;
    }

    #othermessage-content::-webkit-scrollbar-thumb {
        background-color: var(--light-green);
        width: 5px;
        border-radius: 2.5px;
    }
</style>