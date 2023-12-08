<script lang="ts">
    import { page } from '$app/stores'

    export let snowFlakes: number
</script>

<div id="userinfo-container">
    <div id="image-box" style="background-image: url({$page.data.session?.user?.image});"></div>
    <div id="profile-right">
        <div id="profile-text">
            <span>{$page.data.session?.user?.name}</span>
        </div>
        <div id="profile-snowflake">
            <span style="margin-top: 5px; margin-left: 10px; display: flex; align-items: center;">
                <span style="margin-right: 15px;">눈송이 | {snowFlakes} / 1000</span>
                <button id="snowflake-help" title="눈송이가 뭔가요?" on:click={() => {
                    const desc = [
                        `눈송이는 이벤트 기간동안 사용할 수 있는 한정 재화입니다.`,
                        `눈송이는 다양한 경로로 모을 수 있으며,`,
                        `이벤트 역할 등의 혜택 교환권에 사용할 수 있습니다.`,
                        `혜택은 누적 눈송이로 획득할 수 있으며,`,
                        `혜택 획득 시 눈송이가 차감되지는 않습니다.`,
                    ]
                    alert(desc.join("\n"))
                }}>?</button>
            </span>
            <div id="snowflake-bar-background">
                <div id="snowflake-bar" style="width: {snowFlakes / 1000 * 190}px;"></div>
            </div>
        </div>
    </div>
</div>

<style>
    #userinfo-container {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        display: flex;
    }

    #image-box {
        position: relative;
        z-index: 2;
        background-color: #e7c3a9;
        width: 100px;
        height: 100px;
        background-size: 100px;
        border-bottom-right-radius: 5px;
        border-bottom: 5px solid #e29965;
        border-right: 5px solid #e29965;
    }

    #profile-right {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #profile-text {
        position: relative;
        z-index: 2;
        background-color: #e7c3a9;
        width: 200px;
        height: 50px;
        border-bottom-right-radius: 5px;
        border-bottom: 5px solid #e29965;
        border-right: 5px solid #e29965;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #profile-text span {
        font-size: 18px;
    }

    #profile-snowflake {
        position: relative;
        left: -5px;
        top: -5px;
        z-index: 1;
        background-color: #e7c3a9;
        width: 200px;
        height: 35px;
        border-bottom-right-radius: 3px;
        border-bottom: 3px solid #e29965;
        border-right: 3px solid #e29965;
        display: flex;
        flex-direction: column;
    }

    #snowflake-help {
        outline: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid black;
        font-family: Samlip;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    #snowflake-bar-background {
        position: relative;
        top: 1px;
        left: 4px;
        bottom: 0px;
        width: 190px;
        height: 5px;
        background-color: black;
        border-top-right-radius: 2.5px;
        border-bottom-right-radius: 2.5px;
    }

    #snowflake-bar {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 5px;
        background-color: #00aaff;
        border-top-right-radius: 2.5px;
        border-bottom-right-radius: 2.5px;
    }
</style>