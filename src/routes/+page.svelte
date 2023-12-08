<script lang="ts">
    import "../fonts.css"
    import { page } from '$app/stores'
    import { onMount } from "svelte"
    import { signOut } from '@auth/sveltekit/client'
    import { popupEnabled, type challenge } from "../lib/stores"
	import type { PageData } from './$types'
    import Loginpopup from "./loginpopup.svelte"
    import Userinfo from "./userinfo.svelte"
    import Snowflake from "./snowflake.svelte"
    import Earntext from "./earntext.svelte"

    export let data: PageData

    let snowFlakesLoaded = false
    let snowFlakes: number = data.user?.snowflake || 0
    $: {
        if (snowFlakesLoaded) {
            const url = location.protocol + "//" + location.host + `/api/update`
            fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"snowflake",newValue:snowFlakes})})
        }
        else snowFlakesLoaded = true
    }

    let ChallengesLoaded = false
    let Challenges: challenge = JSON.parse(data.challenge.challenges)
    $: {
        if (ChallengesLoaded) {
            const url = location.protocol + "//" + location.host + `/api/update`
            fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"challenge",newValue:Challenges})})
        }
        else ChallengesLoaded = true
    }

    let hasTree: boolean = data.hasTree as boolean

    let santaButton: HTMLButtonElement

    let startTime = 0
    let tryShowFlakeTime = 0

    let showFlake = false
    let earnList: {id:string,amount:number,pos:{x:number,y:number}}[] = []

    let santaEarned = false
    let snowFlakeEarned = false

    function earnSanta(e: MouseEvent) {
        if (santaEarned || !data.session?.user) return

        const target = e.target as HTMLButtonElement
        const rect = target.getBoundingClientRect()

        santaEarned = true

        if (!Challenges.getFirstSanta) {
            Challenges.getFirstSanta = true
            alert(`산타 할아버지, 선물 내놔요! 업적을 달성했습니다.\n보상: 눈송이 10개`)
            snowFlakes += 10
        }

        addEarnList(Math.floor(Math.random() * 6) + 15,{x:rect.x + 121,y:rect.y - 20})
    }

    function earnFlake(e: MouseEvent) {
        if (snowFlakeEarned || !data.session?.user) return

        const target = e.target as HTMLButtonElement
        const rect = target.getBoundingClientRect()

        snowFlakeEarned = true

        if (!Challenges.getFirstSnowFlake) {
            Challenges.getFirstSnowFlake = true
            alert(`하늘에서 떨어지는 눈송이 업적을 달성했습니다.\n보상: 눈송이 5개`)
            snowFlakes += 5
        }

        if (Math.floor(Math.random() * 5) == 0) {
            alert(`특별한 눈송이를 주웠습니다!`)
            addEarnList(5,{x:rect.x + 5,y:rect.y - 15})
        }
        else addEarnList(Math.floor(Math.random() * 2) + 1,{x:rect.x + 5,y:rect.y - 15})
    }

    function addEarnList(amount: number,pos: {x:number,y:number}) {
        const id = crypto.randomUUID()
        earnList.push({id,amount,pos})
        earnList = earnList
        snowFlakes += amount
        setTimeout(() => {
            const index = earnList.findIndex((value) => value.id == id)
            if (index != -1) earnList.splice(index,1)
        },2300)
    }

    function moveSanta(time: number) {
        const width = window.innerWidth

        if (startTime == 0) startTime = time
        else {
            let deltaTime = Math.min(time - startTime,5000)

            santaButton.style.left = `${width * (deltaTime / 5000)}px`

            if (deltaTime >= 5000) {
                santaButton.style.left = `${width}px`
                startTime = 0
                return
            }
        }

        requestAnimationFrame(moveSanta)
    }

    function tryShowFlake(time: number) {
        if (tryShowFlakeTime == 0) tryShowFlakeTime = Math.floor(time + 1500)

        if (time >= tryShowFlakeTime && !showFlake) {
            tryShowFlakeTime = time + 1000
            showFlake = Math.floor(Math.random() * 5) == 1

            if (!showFlake) {
                requestAnimationFrame(tryShowFlake)
                return
            }
            
            const flake = new Snowflake({
                props: {
                    left:`${Math.floor(Math.random() * 80) + 10}%`
                },
                target:document.getElementById(`snowflake-container`) as HTMLDivElement
            })

            flake.$on("click",earnFlake)

            flake.$on("remove",() => {
                tryShowFlakeTime = time + 1000
                showFlake = false
                snowFlakeEarned = false
            })
        }

        requestAnimationFrame(tryShowFlake)
    }

    onMount(() => {
        if (Math.floor(Math.random() * 10) + 1 == 1) requestAnimationFrame(moveSanta) // 산타 띄우기

        requestAnimationFrame(tryShowFlake) // 눈송이 띄우기

        window.addEventListener(`resize`,() => {
            if (startTime == 0) {
                santaButton.style.left = `${window.innerWidth}px`
            }
        })

        if (snowFlakes >= 250 && !Challenges.achieve250) {
            alert(`시작이 반 + 가만히 있으면 반 업적을 달성했습니다.\n보상: 눈송이 25개`)
            Challenges.achieve250 = true
            snowFlakes += 25
        }
        else if (snowFlakes >= 1000 && !Challenges.achieve1000) {
            alert(`이게 되긴 하나? 업적을 달성했습니다.\n보상: 눈송이 0개`)
            Challenges.achieve1000 = true
        }
    })
</script>

<div id="main">
    <div id="welcome">
        <div id="text-top">
            <span>해솔종합병원</span>
            <span id="text-middle">크리스마스 이벤트</span>
        </div>
        <div id="text-bottom">트리 꾸며주기!</div>
        {#if $page.data.session?.user}
            {#if hasTree}
                <button id="start" on:click={() => {location.href = `/trees/${data.user?.id}`}}>내 트리 보기</button>
            {:else}            
                <button id="start" on:click={() => {
                    const url = location.protocol + "//" + location.host + `/api/create`
                    fetch(url,{method:"POST",headers:{"Content-Type":"application/json"}}).then(res => {
                        if (res.status == 200) {
                            alert(`성공적으로 트리를 생성했습니다.`)
                            res.json().then(data => {
                                location.href = data.location
                            })
                        }
                        else alert(`트리를 생성하는 중 오류가 발생했습니다.(${res.status})\n관리자에게 문의해보세요.`)
                    })
                }}>내 트리 만들기</button>
            {/if}
            <div id="middle-button-container">
                <button on:click={() => {location.href = `/challenges`}}>업적</button>
                <button on:click={() => {location.href = `/shop`}} style="margin-left: 15px;">상점</button>
            </div>
            <button id="logout" on:click={() => {
                const result = confirm(`정말로 로그아웃 하시겠습니까?`)
                
                if (result) signOut()
            }}>로그아웃</button>
        {:else}
            <button id="start" on:click={() => {$popupEnabled = true}}>내 트리 만들기</button>
        {/if}
        <button id="view" on:click={() => {location.href = `/view`}}>트리 구경하기</button>
    </div>
    <button
        id="santa"
        bind:this={santaButton}
        on:click={earnSanta}
    ></button>
    <Loginpopup />
    {#if $page.data.session?.user}
        <Userinfo snowFlakes={snowFlakes} />
    {/if}
    {#each earnList as earn (earn.id)}
        <svelte:component this={Earntext} amount={earn.amount} pos={earn.pos} />
    {/each}
    <div id="snowflake-container"></div>
</div>
<div id="height-alert">
    <span>휴대폰을 가로로 돌리셨나요?<br>다시 세로로 돌려주셔야 이용할 수 있습니다.</span>
</div>

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

    #welcome {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    @keyframes textDown {
        from {
            transform: translateY(-1000px);
        }

        to {
            transform: translateY(0px);
        }
    }

    #text-top, #text-bottom {
        animation-name: textDown;
        animation-duration: 1s;
        font-size: 45px;
        color: var(--text-green);
        text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
    }

    @media (max-width: 699px) {
        #text-top {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
    }

    @keyframes buttonUp {
        from {
            transform: translateY(1000px);
        }

        to {
            transform: translateY(0px);
        }
    }

    #start, #view, #logout, #middle-button-container {
        animation-name: buttonUp;
        animation-duration: 1s;
    }

    #start {
        margin-top: 100px;
    }

    #view, #logout, #middle-button-container {
        margin-top: 25px;
    }

    #santa {
        border: none;
        outline: none;
        background-color: transparent;
        position: absolute;
        width: 242px;
        height: 97px;
        background-size: cover;
        background-image: url("/santa.png");
        bottom: 5px;
        left: -242px;
        cursor: pointer;
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