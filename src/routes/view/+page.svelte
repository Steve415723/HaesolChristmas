<script lang="ts">
    import "../../fonts.css"
    import Usertree from "./usertree.svelte"
    import type { PageData } from "./$types"

    export let data: PageData
</script>

<div id="main">
    <div id="title">모든 트리 목록</div>
    <div id="trees">
        {#each data.trees as tree}
            <Usertree data={tree} />
        {/each}
    </div>
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
        width: 100%;
        height: 100%;
        background-image: url("https://cdn.pixabay.com/photo/2021/11/19/15/21/christmas-6809681_1280.png");
        overflow-y: auto;
        overflow-x: hidden;
    }

    #title {
        margin-top: 15px;
        font-size: 35px;
        color: var(--text-green);
        text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
        text-align: center;
    }

    #trees {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
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
</style>