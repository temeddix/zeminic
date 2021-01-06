<template>
    <div
    :class='{[$style.layoutBlock]:true, [$style.debugStyle]:$root.layoutDebugging}'>
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

<style module>
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
    .debugStyle{
        background-color: #ffaaff;
        border: 1px solid #ff33ff;
    }
</style>