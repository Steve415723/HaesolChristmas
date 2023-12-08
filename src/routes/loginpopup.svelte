<script lang="ts">
    import { popupEnabled } from "../lib/stores"
    import { signIn } from '@auth/sveltekit/client'

    let mainDiv: HTMLDivElement
    let popupDiv: HTMLDivElement

    let startTime = 0

    const log500 = Math.log10(500)

    function downAnimation(time: number) {
        if (startTime == 0) startTime = time
        else {
            let deltaTime = Math.min(time - startTime,1000)

            popupDiv.style.top = `calc(50% - ${1000 - 1000 / log500 * Math.log10(deltaTime)}px)`

            if (deltaTime >= 500) {
                popupDiv.style.top = `50%`
                startTime = 0
                return
            }
        }
        
        requestAnimationFrame(downAnimation)
    }

    popupEnabled.subscribe((value) => {
        if (!mainDiv) return
        
        if (!value) {
            mainDiv.style.display = `none`
            popupDiv.style.top = `calc(50% - 1000px)`
            return
        }
        mainDiv.style.display = `block`
        requestAnimationFrame(downAnimation)
    })
</script>

<div id="login-bg" bind:this={mainDiv} style="display: none;">
    <div id="login-popup" bind:this={popupDiv}>
        <div id="login-texts">
            <div id="login-title">[ 디스코드 계정으로 로그인 ]</div>
            <div class="login-desc" style="margin-top: 10px;">트리를 만드려면 디스코드로 로그인하세요.</div>
            <div class="login-desc" style="margin-top: 15px;">로그인 시, 다음의 정보를 수집하는 데</div>
            <div class="login-desc">동의한 것으로 간주됩니다.</div>
        </div>
        <ul>
            <li>기본적인 프로필 정보 + 이메일</li>
            <ul>
                <li>유저 식별에 사용됩니다.</li>
            </ul>
        </ul>
        <div id="login-button-container">
            <button class="login-button" on:click={() => {signIn("discord")}}>로그인</button>
            <button class="login-button" style="margin-left: 25px;" on:click={() => {$popupEnabled = false}}>나가기</button>
        </div>
    </div>
</div>

<style>
    #login-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
    }

    #login-popup {
        position: absolute;
        top: calc(50% - 1000px);
        left: 50%;
        transform: translate(-50%,-50%);
        width: 60vw;
        min-width: 300px;
        height: calc(60vw * 0.696875);
        min-height: calc(300px * 0.696875);
        border: 5px solid var(--border-red);
        border-radius: 5px;
        background-image: url("https://cdn.pixabay.com/photo/2015/12/06/20/10/christmas-bauble-1079926_1280.jpg");
        background-size: cover;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
    }

    #login-popup::-webkit-scrollbar {
        background-color: black;
        width: 5px;
        border-radius: 2.5px;
    }

    #login-popup::-webkit-scrollbar-thumb {
        background-color: var(--light-green);
        width: 5px;
        border-radius: 2.5px;
    }

    #login-texts {
        color: var(--text-green);
        text-align: center;
    }

    #login-title {
        font-size: 25px;
        margin-top: 35px;
    }

    .login-desc {
        font-size: 18px;
    }

    #login-button-container {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 35px;
    }

    li::marker {
        color: var(--marker-green);
    }

    ul {
        display: table;
        margin-left: auto;
        margin-right: auto;
        padding: 0;
        font-size: 18px;
    }

    ul li {
        color: var(--text-green);
    }

    ul ul li {
        color: var(--text-red);
    }
</style>