<script lang="ts">
    import { onMount } from "svelte"
    import "../../../fonts.css"
	import type { PageData } from './$types'
    import { popupEnabled } from "./stores"
    import Message from "./message.svelte"
    import Addpost from "./addpost.svelte"
    import Othermessage from "./othermessage.svelte"

    export let data: PageData

    const christmasTime = 1703430000

    let messages: {id: string,name: string,content: string,index: number,rotate: number}[] = data.treeData?.messages ? JSON.parse(data.treeData.messages) : []

    let msgIndex = 0
    let isPublic = false

    const messagePos = [
        {top: 225,left: 125},
        {top: 300,left: 80},
        {top: 300,left: 165},
        {top: 375,left: 50},
        {top: 375,left: 125},
        {top: 375,left: 200},
        {top: 475,left: 15},
        {top: 475,left: 90},
        {top: 475,left: 165},
        {top: 475,left: 240},
    ]

    onMount(() => {
        if (!data.treeData) {
            alert(`존재하지 않는 트리입니다.`)
            location.href = `/`
        }
    })
</script>

{#if data.treeData}
    <div id="main">
        <div id="name"><span style="color: var(--text-red);">{data.treeData.name}</span><span>님의 트리</span></div>
        <div id="tree">
            {#each messages.slice(0,10) as message, index (message.id)}
                <button
                    class="tree-item"
                    style="
                        top: {messagePos[index].top}px;
                        left: {messagePos[index].left}px;
                        transform: rotate({message.rotate}deg);
                        background-image: url('/posts/post{message.index}.png');
                    "
                    on:click={() => {
                        const now = Math.floor(Date.now() / 1000)

                        msgIndex = index
                        isPublic = (message.id == data.user?.id) ? true : (christmasTime <= now && data.treeData.id == data.user?.id) ? true : false
                        $popupEnabled = "othermessage"
                    }}
                >
                    <span class="tree-item-name">{message.name}</span>
                </button>
            {/each}
        </div>
        <div id="button-container">
            <button on:click={() => {
                if (data.treeData.id == data.user?.id) return alert(`자기 자신의 트리에는 선물할 수 없습니다.\n선물이 없어서 많이 외로우셨나요?`)
                if (!data.session?.user) return alert(`로그인이 필요한 기능입니다.`)

                $popupEnabled = "addpost"
            }}>트리에 메시지 달아주기</button>
        </div>
        <button id="post" on:click={() => {$popupEnabled = "message"}} title="클릭해서 확인"></button>
        <Message treeData={data.treeData} user={data.user} challenges={data.challenge.challenges ? JSON.parse(data.challenge.challenges) : {}} />
        <Addpost name={data.session?.user?.name} user={data.user} treeData={data.treeData} challenges={data.challenge.challenges ? {...data.challenge,challenges:JSON.parse(data.challenge.challenges)} : {}} />
        <Othermessage message={messages[msgIndex]} isPublic={isPublic} />
    </div>
    <div id="height-alert">
        <span>휴대폰을 가로로 돌리셨나요?<br>다시 세로로 돌려주셔야 이용할 수 있습니다.</span>
    </div>
{:else}
    <div style="text-align: center;">존재하지 않는 트리입니다.</div>
{/if}

<style>
    :global(body) {
        margin: 0;
        box-sizing: border-box;
        width: 100%;
        height: 100vh;
        font-family: Samlip;
        overflow: hidden;
        user-select: none;

        --border-red: #7e121d;
        --text-green: #036f3e;
        --text-red: #d40028;
        --light-green: #13cc4e;
        --marker-green: #00a53c;
    }

    :global(button) {
        border: 2px solid var(--border-red);
        border-radius: 5px;
        padding: 5px;
        margin: 1px;
        outline: none;
        color: black;
        font-family: Samlip;
        background-image: url("/box.png");
        background-position: center;
        cursor: pointer;
        font-size: 20px;
    }

    #main {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url("https://cdn.pixabay.com/photo/2017/10/11/10/05/winter-2840549_1280.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow: hidden;
    }

    @media (max-width: 1280px) {
        #main {
            background-size: 1280px 100%;
            background-position: left;
        }
    }

    #name {
        position: absolute;
        font-size: 35px;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--text-green);
        text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media (min-width: 650px) {
        #name {
            flex-direction: row;
        }
    }

    #tree {
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        background-image: url("https://cdn.pixabay.com/photo/2019/11/18/01/31/tree-4633768_1280.png");
        background-size: 100% 100%;
        width: 315px;
        height: 650px;
    }

    .tree-item {
        position: absolute;
        z-index: 2;
        width: 50px;
        height: 50px;
        background-size: 100% 100%;
        background-color: transparent;
        border: none;
    }

    .tree-item-name {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12.5px;
    }

    #button-container {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 250px;
        height: 30px;
        font-size: 25px;
        text-align: center;
    }

    #post {
        position: absolute;
        bottom: 80px;
        left: calc(50% - 110px);
        transform: translateX(-50%);
        border: none;
        outline: none;
        background-color: transparent;
        background-image: url("https://cdn.pixabay.com/photo/2023/06/09/19/37/letter-8052497_1280.png");
        width: 50px;
        height: 50px;
        background-size: 100% 100%;
    }

    #height-alert {
        display: none;
    }

    @media (max-height: 699px) {
        #main {
            display: none;
        }

        #height-alert {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background-image: url("https://cdn.pixabay.com/photo/2021/11/19/15/21/christmas-6809681_1280.png");
            overflow: hidden;
            text-align: center;
            font-size: 30px;
            color: var(--text-green);
            text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
        }
    }
</style>