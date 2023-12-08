<script lang="ts">
    import "../../fonts.css"
    import { page } from '$app/stores'
    import { onMount } from "svelte"
    import type { PageData } from "./$types"
    import type { challenge } from "$lib/stores"

    export let data: PageData

    let Challenges: challenge = JSON.parse(data.challenge.challenges)

    const challengeNames: {[name: string]: string} = {
        getFirstSnowFlake: "하늘에서 떨어지는 눈송이",
        getFirstSanta: "산타 할아버지, 선물 내놔요!",
        createTree: "나도 있다, 크리스마스 트리!",
        likeToPost: "네 쪽지 쩔더라?",
        postToTree: "이걸 보고도 크리스마스까지<br>기다릴 수 있겠어?",
        postFiveTrees: "편지가 5개!",
        postTenTrees: "모조리 축하해버릴테다!",
        achieve250: "시작이 반 + 가만히 있으면 반",
        achieve1000: "이게 되긴 하나?"
    }

    const challengeDescs: {[name: string]: string} = {
        getFirstSnowFlake: "로비에서 떨어지는 눈송이를 하나 주우세요.",
        getFirstSanta: "로비에서 나오는 산타를 클릭하세요.",
        createTree: "나만의 트리를 생성하세요.",
        likeToPost: "다른 사람의 쪽지에 좋아요를 누르세요.",
        postToTree: "다른 사람의 트리에 선물을 하나 주세요.",
        postFiveTrees: "다른 사람의 트리에 선물을 5개 주세요.",
        postTenTrees: "다른 사람의 트리에 선물을 10개 주세요.",
        achieve250: "눈송이 250개를 모으세요.",
        achieve1000: "눈송이를 최대치로 모으세요."
    }

    const challengeRewards: {[name: string]: number} = {
        getFirstSnowFlake: 5,
        getFirstSanta: 10,
        createTree: 5,
        likeToPost: 5,
        postToTree: 10,
        postFiveTrees: 25,
        postTenTrees: 50,
        achieve250: 25,
        achieve1000: 0
    }

    onMount(() => {
        if (!$page.data.session?.user) {
            alert(`로그인 후 이용할 수 있는 페이지입니다.`)
            location.href = `/`
        }
    })
</script>

{#if $page.data.session?.user}
    <div id="main">
        <div id="challenges-container">
            <div id="challenge-title">
                <span>업적</span>
                <button on:click={() => {location.href = "/"}}>돌아가기</button>
            </div>
            {#each Object.keys(Challenges) as key (key)}
                <div class="challenge-item" style="opacity: {Challenges[key] ? 1 : 0.5};">
                    <div class="challenge-name">{@html challengeNames[key]}</div>
                    <div class="challenge-desc">{challengeDescs[key]}</div>
                    <div class="challenge-reward">보상: 눈송이 {challengeRewards[key]}개</div>
                </div>
            {/each}
        </div>
    </div>
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

    button {
        width: 125px;
        height: 45px;
        margin-left: 25px;
    }

    #main {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url("https://cdn.pixabay.com/photo/2021/11/19/15/21/christmas-6809681_1280.png");
        overflow-y: auto;
    }

    #main::-webkit-scrollbar {
        background-color: black;
        width: 5px;
        border-radius: 2.5px;
    }

    #main::-webkit-scrollbar-thumb {
        background-color: var(--light-green);
        width: 5px;
        border-radius: 2.5px;
    }

    #challenges-container {
        display: flex;
        flex-direction: column;
    }

    #challenge-title {
        margin-left: 15px;
        margin-top: 15px;
        display: flex;
        align-items: center;
    }

    #challenge-title span {
        color: var(--text-green);
        font-size: 35px;
        text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
    }

    .challenge-item {
        width: 275px;
        height: 100px;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        background-color: var(--border-red);
        margin-top: 15px;
        margin-bottom: 15px;
        color: var(--text-green);
    }

    .challenge-name {
        margin-top: 10px;
        font-size: 20px;
        margin-left: 5px;
    }

    .challenge-desc {
        margin-top: 10px;
        margin-left: 5px;
    }

    .challenge-reward {
        margin-top: 5px;
        margin-left: 5px;
    }
</style>