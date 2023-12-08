<script lang="ts">
    export let data: any
</script>

<div class="user-tree">
    <div><span style="color: var(--text-red);">{data.name}</span><span style="color: var(--text-green);">님의 트리</span></div>
    <button on:click={() => {location.href = `/trees/${data.id}`}}>방문하기</button>
</div>

<style>
    .user-tree {
        position: relative;
        width: 200px;
        height: calc(200px * 1280/853);
        background-image: url("https://cdn.pixabay.com/photo/2019/11/18/01/31/tree-4633768_1280.png");
        background-size: 100% 100%;
    }

    .user-tree div {
        position: absolute;
        width: 100%;
        bottom: -1px;
        text-align: center;
        font-size: 18px;
    }

    .user-tree button {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        bottom: -35px;
        font-size: 18px;
    }
</style>