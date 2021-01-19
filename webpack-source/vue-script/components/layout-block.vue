<template>
    <div
    class='layoutBlock'>
        <slot></slot>
    </div>
</template>

<script>
export default {
    data: function() { return {
    }},
    props:{
    },
    computed: {
    },
    methods:{
    },
    watch: {
    },
    created: function(){
    },
    mounted: function(){
    },
};
</script>

<style scoped>
    .layoutBlock{
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        margin: 6px 0px;
        padding: 0px 20px;
    }
</style>