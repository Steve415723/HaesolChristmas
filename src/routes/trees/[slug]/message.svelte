<script lang="ts">
    import type { challenge } from "$lib/stores"
    import { popupEnabled } from "./stores"

    let mainDiv: HTMLDivElement
    let popupDiv: HTMLDivElement
    let textArea: HTMLTextAreaElement

    export let treeData: any
    export let user: any
    export let challenges: challenge

    let startTime = 0

    const log500 = Math.log10(500)

    function upAnimation(time: number) {
        if (startTime == 0) startTime = time
        else {
            let deltaTime = Math.min(time - startTime,1000)

            popupDiv.style.top = `calc(50% + ${1000 - 1000 / log500 * Math.log10(deltaTime)}px)`

            if (deltaTime >= 500) {
                popupDiv.style.top = `50%`
                startTime = 0
                return
            }
        }
        
        requestAnimationFrame(upAnimation)
    } 
    
    popupEnabled.subscribe((value) => {
        if (!mainDiv) return
        
        if (value != "message") {
            mainDiv.style.display = `none`
            popupDiv.style.top = `calc(50% + 1000px)`
            return
        }

        mainDiv.style.display = `block`
        requestAnimationFrame(upAnimation)
    })
</script>

<div id="message-container" bind:this={mainDiv} style="display: none;">
    <div id="message-popup" bind:this={popupDiv}>
        <div id="message-title"><span>{treeData.name}</span><span style="color: var(--text-green);">님의 메시지</span></div>
        {#if treeData.id == user?.id}
            <textarea id="input-content" spellcheck="false" value={treeData.post} bind:this={textArea}></textarea>
        {:else}
            <div id="message-content">{treeData.post || "아직 메시지가 없습니다."}</div>
        {/if}
        <div id="message-bottom">
            <div id="message-like-container">
                <button
                    id="message-like-button"
                    on:click={() => {
                        if (treeData.id == user?.id) return alert(`자기 자신의 트리에는 추천할 수 없습니다.`)
                        if (!user) return alert(`로그인이 필요한 기능입니다.`)

                        if (!challenges.likeToPost) {
                            alert(`네 쪽지 쩔더라? 업적을 달성했습니다.\n보상: 눈송이 5개`)
                            challenges.likeToPost = true
                            const url = location.protocol + "//" + location.host + `/api/update`
                            fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"snowflake",newValue:user.snowflake + 5})})
                            fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"challenge",newValue:challenges})})
                        }

                        const url = location.protocol + "//" + location.host + `/api/tree/like`
                        fetch(url,{method:"POST",body:JSON.stringify({targetid:treeData.id})})
                        .then(async res => {
                            if (res.status == 204) alert(`성공적으로 좋아요를 눌렀습니다.`)
                            else if (res.status == 500) alert(`좋아요 등록에 실패했습니다.(${res.status})\n관리자에게 문의해주세요.`)
                            else alert((await res.json()).message)

                            location.href = location.href
                        })
                    }}
                >👍</button>
                <span>{treeData.like}</span>
            </div>
            {#if treeData.id == user?.id}
                <button
                    style="margin-right: 10px;"
                    on:click={() => {
                        const value = textArea.value

                        const url = location.protocol + "//" + location.host + `/api/update`
                        fetch(url,{method:"POST",body:JSON.stringify({id:user?.id,newValue:value})})
                        .then(res => {
                            if (res.status == 204) alert(`성공적으로 저장했습니다.`)
                            else alert(`저장에 실패했습니다.(${res.status})\n관리자에게 문의해주세요.`)

                            $popupEnabled = undefined
                        })
                    }}
                >완료</button>
            {/if}
            <button on:click={() => {$popupEnabled = undefined}}>닫기</button>
        </div>
    </div>
</div>

<style>
    #message-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
    }

    #message-popup {
        position: absolute;
        top: calc(50% + 1000px);
        left: 50%;
        transform: translate(-50%,-50%);
        width: 300px;
        height: 300px;
        border-radius: 5px;
        background-image: url("/message.png");
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #message-title {
        margin-top: 55px;
        font-size: 30px;
        color: var(--text-red);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #input-content {
        margin-top: 15px;
        width: 80%;
        height: 90px;
        margin-bottom: 15px;
        resize: none;
        border: none;
        outline: none;
        background-color: transparent;
        font-family: Samlip;
        font-size: 16px;
    }

    #input-content::-webkit-scrollbar {
        background-color: black;
        width: 5px;
        border-radius: 2.5px;
    }

    #input-content::-webkit-scrollbar-thumb {
        background-color: var(--light-green);
        width: 5px;
        border-radius: 2.5px;
    }

    #message-content {
        margin-top: 15px;
        width: 80%;
        height: 90px;
        margin-bottom: 15px;
        overflow-y: auto;
        white-space: pre-line;
    }

    #message-content::-webkit-scrollbar {
        background-color: black;
        width: 5px;
        border-radius: 2.5px;
    }

    #message-content::-webkit-scrollbar-thumb {
        background-color: var(--light-green);
        width: 5px;
        border-radius: 2.5px;
    }

    #message-bottom {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #message-like-container {
        margin-right: 25px;
    }

    #message-like-button {
        border: none;
        background-color: transparent;
        background-image: none;
        padding: 0;
        margin: 0;
    }
</style>