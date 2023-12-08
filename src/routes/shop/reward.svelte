<script lang="ts">
    import { popupEnabled } from "./stores"

    export let info: {id: string,type: string}

    let mainDiv: HTMLDivElement

    popupEnabled.subscribe((value) => {
        if (!mainDiv) return
        
        if (!value) {
            mainDiv.style.display = `none`
            return
        }

        mainDiv.style.display = `block`
    })
</script>

<div id="reward-container" bind:this={mainDiv} style="display: none;">
    <div id="reward-popup">
        <div id="reward-title"><span>[ 교환권 ]</span><span>{info.type}</span></div>
        <div id="reward-id">교환권 아이디</div>
        <div id="reward-id" style="margin-top: 5px; user-select: text;">[ {info.id} ]</div>
        <div id="reward-desc">
            해당 교환권(또는 아이디)을 교환권 인증 채널에 제시하여 역할을 받을 수 있습니다.
            또한 교환권의 보상이나 주인 등을 개발자는 다 알고 있기 때문에
            해당 사항을 위조할 경우 머리에 마구니가 낀 것으로 판단해
            궁예의 철퇴가 날아올 수 있으니 주의해주세요.
        </div>
        <div id="reward-button-container">
            <button on:click={() => {navigator.clipboard.writeText(info.id); alert(`복사 완료!`)}}>아이디 복사</button>
            <button style="margin-left: 10px;" on:click={() => {$popupEnabled = false}}>닫기</button>
        </div>
    </div>
</div>

<style>
    #reward-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        text-align: center;
    }

    #reward-popup {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 800px;
        height: 500px;
        max-width: 95vw;
        max-height: calc(95vw * 72/128);
        border-radius: 5px;
        background-image: url("https://cdn.pixabay.com/photo/2017/10/26/19/45/red-2892235_1280.png");
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #reward-popup::-webkit-scrollbar {
        background-color: black;
        width: 5px;
        border-radius: 2.5px;
    }

    #reward-popup::-webkit-scrollbar-thumb {
        background-color: var(--light-green);
        width: 5px;
        border-radius: 2.5px;
    }

    #reward-title {
        margin-top: 15px;
        color: var(--light-green);
        text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
        font-size: 35px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #reward-id {
        margin-top: 40px;
        color: white;
        font-size: 25px;
    }

    #reward-desc {
        overflow-wrap: break-word;
        margin-top: 20px;
        color: white;
        font-size: 18px;
        width: 90%;
    }

    #reward-button-container {
        margin-top: 5px;
        margin-bottom: 15px;
    }
</style>