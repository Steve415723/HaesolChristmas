<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte"

    const dispatch = createEventDispatcher()

    export let left: string
    
    let snowflakeButton: HTMLButtonElement

    onMount(() => {
        snowflakeButton.setAttribute("gfriend","forever")
        snowflakeButton.setAttribute("snowflake","rough")

        setTimeout(() => {snowflakeButton.remove(); dispatch("remove")},11000)
    })
</script>

<button id="snowflake" bind:this={snowflakeButton} style="left: {left};" on:click></button>

<style>
    @keyframes moveVertical {
        from {
            top: -25px;
        }

        to {
            top: 100vh;
        }
    }

    @keyframes moveHorizontal {
        from {
            transform: translateX(0px);
        }

        12.5% {
            transform: translateX(-45px);
        }

        37.5% {
            transform: translateX(45px);
        }

        50% {
            transform: translateX(0px);
        }

        62.5% {
            transform: translateX(-45px);
        }

        87.5% {
            transform: translateX(45px);
        }

        to {
            transform: translateX(0px);
        }
    }

    #snowflake {
        border: none;
        outline: none;
        background-color: transparent;
        position: absolute;
        width: 25px;
        height: 25px;
        background-image: url("/snowflake.png");
        background-size: 25px;
        z-index: 5;
        animation: 10s linear moveVertical, 10s ease-in-out infinite moveHorizontal;
        cursor: pointer;
    }
</style>