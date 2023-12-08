import { writable } from "svelte/store"

export const popupEnabled = writable(false)

export interface challenge {
    [key: string]: boolean,
    getFirstSnowFlake: boolean, // 첫 눈송이 클릭하기
    getFirstSanta: boolean, // 첫 산타 클릭하기
    createTree: boolean, // 내 트리 생성하기
    likeToPost: boolean, // 상대방 트리의 메시지에 좋아요 누르기
    postToTree: boolean, // 상대방 트리에 첫 편지 작성
    postFiveTrees: boolean, // 상대방 트리에 편지 5개 작성
    postTenTrees: boolean, // 상대방 트리에 편지 10개 작성
    achieve250: boolean, // 눈송이 250개 달성
    achieve1000: boolean, // 눈송이 1000개(최대치) 달성
}