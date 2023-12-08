<script lang="ts">
    import "../../fonts.css"
    import { onMount } from "svelte"
    import type { PageData } from "./$types"
    import { popupEnabled } from "./stores"
    import Reward from "./reward.svelte"

    export let data: PageData

    const shopItem = [
        {desc:"[ 🎁 ] ˚₊·2023 크리스마스의 작은 선물·₊˚",cost:50},
        {desc:"[ 🎄 ] ˚₊·2023 크리스마스가 꽃피운 트리·₊˚",cost:100},
        {desc:"[ ☃️ ] ˚₊·2023 크리스마스의 축복·₊˚",cost:200},
        {desc:"[ 🎅 ] ˚₊·2023 크리스마스 그 자체·₊˚",cost:300},
        {desc:"[ 💙 ] 개발자가 당신을 좋아합니다.",cost:1000},
    ]

    let rewardInfo: {id: string,type: string} = {id:"test",type:"[ 🎄 ] ˚₊·2023 크리스마스가 꽃피운 트리·₊˚"}

    onMount(() => {
        console.log(data)

        if (!data.session?.user) {
            alert(`로그인 후 이용할 수 있는 페이지입니다.`)
            location.href = `/`
        }
    })
</script>

{#if data.session?.user}
    <div id="main">
        <div id="shop-title">상점</div>
        <div style="text-align: center; margin-top: 5px;"><button style="width: 100px;" on:click={() => {location.href = "/"}}>돌아가기</button></div>
        <div id="item-container">
            {#each shopItem as item}
                <div class="shop-item" style="opacity: {item.cost > data.user?.snowflake ? 0.5 : 1}; cursor: {item.cost > data.user?.snowflake ? "not-allowed" : "default"};">
                    <div class="item-name">{item.cost == 1000 ? "???" : "특별 역할"}</div>
                    <div class="item-desc">{item.desc}</div>
                    <button
                        class="item-get"
                        disabled={item.cost > data.user?.snowflake}
                        style="cursor: {item.cost > data.user?.snowflake ? "not-allowed" : "pointer"};"
                        on:click={() => {
                            if (item.cost > data.user?.snowflake) return // disabled 뚫을 수도 있음

                            const url = location.protocol + "//" + location.host + `/api/reward`
                            fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({value:String(item.cost)})})
                            .then(async res => {
                                if (res.status >= 400) {
                                    return alert(`교환권 발급에 실패했습니다.(${res.status})\n관리자에게 문의해주세요.`)
                                }
                                const data = await res.json()
                                rewardInfo = {id:data.message,type:item.desc}
                                $popupEnabled = true
                            })
                        }}
                    >교환권 받기(눈송이 {item.cost}개)</button>
                </div>
            {/each}
        </div>
        {#if popupEnabled}
            <Reward info={rewardInfo} />
        {/if}
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

    #main {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url("https://cdn.pixabay.com/photo/2021/11/19/15/21/christmas-6809681_1280.png");
        overflow: hidden;
    }

    #shop-title {
        margin-top: 5px;
        font-size: 35px;
        text-align: center;
        color: var(--text-green);
        text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
    }

    #item-container {
        margin-top: 15px;
        height: calc(100% - 35px);
        max-height: calc(100% - 35px);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    #item-container::-webkit-scrollbar {
        background-color: black;
        width: 5px;
        border-radius: 2.5px;
    }

    #item-container::-webkit-scrollbar-thumb {
        background-color: var(--light-green);
        width: 5px;
        border-radius: 2.5px;
    }

    .shop-item {
        background-image: none;
        width: 275px;
        height: 100px;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        background-color: var(--border-red);
        margin-top: 15px;
        margin-bottom: 15px;
        color: var(--text-green);
    }

    .item-name {
        margin-top: 5px;
        font-size: 25px;
        margin-left: 5px;
    }

    .item-desc {
        margin-top: 5px;
        margin-left: 5px;
    }

    .item-get {
        margin-top: 5px;
        margin-left: 5px;
        border: 1px solid var(--light-green);
        font-size: 15px;
    }
</style>