<script lang="ts">
    import { onMount } from "svelte"

    let containerDiv: HTMLDivElement

    export let amount: number
    export let pos: {x:number,y:number}

    onMount(() => {
        setTimeout(() => {containerDiv.remove()},2300)
    })
</script>

<div class="earn-text-container" bind:this={containerDiv} style="top: {pos.y}px; left: {pos.x}px;">
    <div class="earn-text-image"></div>
    <div class="earn-text-amount">+{amount}</div>
</div>

<style>
    @keyframes up {
        from {
            transform: translateY(0px);
            opacity: 1;
        }

        to {
            transform: translateY(-100px);
            opacity: 0;
        }
    }

    .earn-text-container {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        animation-name: up;
        animation-duration: 2.5s;
    }

    .earn-text-image {
        width: 20px;
        height: 20px;
        background-image: url("/snowflake.png");
        background-size: 20px;
    }

    .earn-text-amount {
        margin-left: 5px;
        font-size: 18px;
        color: var(--text-green);
    }
</style>