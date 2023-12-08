<script lang="ts">
    import { onMount } from "svelte"
    import { popupEnabled } from "./stores"
    import type { challenge } from "$lib/stores"

    export let user: any
    export let name: any
    export let treeData: any
    export let challenges: {id: string,challenges: challenge,postcount: number}

    let mainDiv: HTMLDivElement
    let pictureContainer: HTMLDivElement

    let selectedIndex = -1

    let inputValue: string
    $: {
        if (inputValue) {
            if (inputValue.length > 50) inputValue = inputValue.slice(0,50)
        }
    }

    let inputName: string
    $: {
        if (inputName) {
            if (inputName.length > 15) inputName = inputName.slice(0,15)
        }
    }

    popupEnabled.subscribe((value) => {
        if (!mainDiv) return
        
        if (value != "addpost") {
            mainDiv.style.display = `none`
            return
        }

        mainDiv.style.display = `block`
    })

    function selectPicture(e: MouseEvent) {
        Array.from(pictureContainer.children).forEach((child) => {
            const element = child as HTMLElement

            element.style.border = `2px solid var(--border-red)`
        })

        const target = e.target as HTMLElement
        target.style.border = `2px solid var(--light-green)`
        selectedIndex = Number(/url\("\/posts\/post(?<index>.+?).png"\)/.exec(target.style.backgroundImage)?.groups?.index)
    }

    onMount(() => {
        inputName = name ?? ""
    })
</script>

<div id="post-container" bind:this={mainDiv} style="display: none;">
    <div id="post-popup">
        <div id="post-picture-title"><span>트리에 달아 줄</span> <span>장식을 선택하세요</span></div>
        <div id="post-pictures" bind:this={pictureContainer}>
            {#each new Array(7) as _, index}
                <button class="post-picture" style="background-image: url('/posts/post{index + 1}.png');" on:click={selectPicture}></button>
            {/each}
        </div>
        <div id="post-message-title"><span>트리 주인에게</span> <span>하고 싶은 말을 입력해주세요</span></div>
        <input
            type="text"
            placeholder="하고 싶은 말을 입력해주세요.(최대 50자)"
            bind:value={inputValue}
        />
        <div id="post-name-title"><span>트리 선물에 보일</span> <span>이름을 입력해주세요</span></div>
        <input
            type="text"
            placeholder="트리 주인에게 보일 이름을 입력해주세요.(최대 15자)"
            bind:value={inputName}
        />
        <div id="post-button-container">
            <button
                on:click={() => {
                    if (!inputValue || !inputName) return alert(`선물 내용이나 이름은 공백일 수 없습니다.`)
                    if (selectedIndex == -1) return alert(`트리에 달아 줄 장식을 선택해주세요.`)

                    const postURL = location.protocol + "//" + location.host + `/api/tree/post`
                    fetch(postURL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({targetid:treeData.id,content:inputValue,name:inputName,index:selectedIndex})})
                    .then(async res => {
                        alert((await res.json()).message)

                        if (res.status == 200) {
                            challenges.postcount++

                            const challengeURL = location.protocol + "//" + location.host + `/api/update`
                            fetch(challengeURL,{method:"POST",body:JSON.stringify({type:"postcount"})})

                            if (challenges.postcount == 1 && !challenges.challenges.postToTree) {
                                challenges.challenges.postToTree = true
                                alert(`이걸 보고도 크리스마스까지 기다릴 수 있겠어? 업적을 달성했습니다.\n보상: 눈송이 10개`)
                                fetch(challengeURL,{method:"POST",body:JSON.stringify({type:"snowflake",newValue:user.snowflake + 10})})
                                fetch(challengeURL,{method:"POST",body:JSON.stringify({type:"challenge",newValue:challenges.challenges})})
                            }
                            else if (challenges.postcount == 5 && !challenges.challenges.postFiveTrees) {
                                challenges.challenges.postFiveTrees = true
                                alert(`편지가 5개! 업적을 달성했습니다.\n보상: 눈송이 25개`)
                                fetch(challengeURL,{method:"POST",body:JSON.stringify({type:"snowflake",newValue:user.snowflake + 25})})
                                fetch(challengeURL,{method:"POST",body:JSON.stringify({type:"challenge",newValue:challenges.challenges})})
                            }
                            else if (challenges.postcount == 10 && !challenges.challenges.postTenTrees) {
                                challenges.challenges.postTenTrees = true
                                alert(`모조리 축하해버릴테다! 업적을 달성했습니다.\n보상: 눈송이 50개`)
                                fetch(challengeURL,{method:"POST",body:JSON.stringify({type:"snowflake",newValue:user.snowflake + 50})})
                                fetch(challengeURL,{method:"POST",body:JSON.stringify({type:"challenge",newValue:challenges.challenges})})
                            }
                        }
                        
                        location.href = location.href
                    })
                }}
            >확인</button>
            <button on:click={() => {$popupEnabled = undefined}} style="margin-left: 25px;">취소</button>
        </div>
    </div>
</div>

<style>
    #post-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
    }

    #post-popup {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 700px;
        height: 500px;
        max-width: 95vw;
        max-height: calc(95vw * 5/7);
        border-radius: 5px;
        background-image: url("https://cdn.pixabay.com/photo/2016/12/11/15/49/old-post-card-1899649_1280.jpg");
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #post-popup::-webkit-scrollbar {
        background-color: black;
        width: 5px;
        border-radius: 2.5px;
    }

    #post-popup::-webkit-scrollbar-thumb {
        background-color: var(--light-green);
        width: 5px;
        border-radius: 2.5px;
    }

    #post-picture-title {
        margin-top: 15px;
        color: var(--text-green);
        font-size: 25px;
    }

    @media (max-width: 549px) {
        #post-picture-title {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    #post-pictures {
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        max-width: 95%;
        height: 65px;
        min-height: 65px;
        margin-top: 10px;
    }

    #post-pictures::-webkit-scrollbar {
        background-color: black;
        height: 5px;
        border-radius: 2.5px;
    }

    #post-pictures::-webkit-scrollbar-thumb {
        background-color: var(--light-green);
        height: 5px;
        border-radius: 2.5px;
    }

    .post-picture {
        width: 50px;
        height: 50px;
        min-width: 50px;
        margin-left: 5px;
        margin-right: 10px;
        border: 2px solid var(--border-red);
        border-radius: 5px;
        background-size: 50px 50px;
        background-color: transparent;
    }

    #post-message-title {
        margin-top: 25px;
        color: var(--text-green);
        font-size: 25px;
    }

    @media (max-width: 549px) {
        #post-message-title {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    #post-name-title {
        margin-top: 15px;
        color: var(--text-green);
        font-size: 25px;
    }

    @media (max-width: 549px) {
        #post-name-title {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    input {
        padding: 5px;
        outline: none;
        border: 3px solid var(--marker-green);
        border-radius: 5px;
        background-color: #e29965;
        width: 90%;
        font-size: 18px;
        font-family: Samlip;
        margin-top: 10px;
    }

    #post-button-container {
        margin-top: 25px;
        margin-bottom: 15px;
    }
</style>