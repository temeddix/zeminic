<template>
    <div :class='{[$style.componentWrapper]:true, [$style.debugStyle]: $root.layoutDebugging}'>
        <div :class='$style.spacingBlock'></div>
        <div :class='$style.lineAndDiamond'>
            <div :class='$style.sideSpacing'></div>
            <div :class='$style.thinLine'></div>
            <div :class='$style.diamondWrapper'>
                <svg width='18' height='18'>
                    <polygon points='0,9 9,0 18,9 9,18' style='fill:rgba(0,0,0,0.3);'/>
                </svg>
            </div>
            <div :class='$style.thinLine'></div>
            <div :class='$style.sideSpacing'></div>
        </div>
        <div :class='$style.spacingBlock'></div>
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
    .componentWrapper{
        display: inline-block;
        width: 100%;
        margin-top: 6px;
        margin-bottom: 6px;
    }
    .spacingBlock{
        width: 100%;
        height: 10px;
    }
    .lineAndDiamond{
        display: flex;
        align-items: center;
    }
    .thinLine{
        height: 1px;
        margin: 8px;
        background-color: rgba(0,0,0,0.3);
        flex: 1 100px;
    }
    .diamondWrapper{
        flex: 0 18px;
    }
    .debugStyle{
        background-color: #ffaaff;
        border: 1px solid #ff33ff;
    }
    .sideSpacing{
        flex: 0.2 50px;
        height: 30px;
    }
</style>