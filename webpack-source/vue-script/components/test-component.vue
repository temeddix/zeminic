<template>
<div>
    <v-expansion-panels>
        <v-expansion-panel
            v-for="(item,i) in 5"
            :key="i"
        >
            <v-expansion-panel-header>
            Item
            </v-expansion-panel-header>
            <v-expansion-panel-content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>

    <v-btn elevation="15">이건 버튼이다 버튼</v-btn>

    <v-checkbox
    v-model="checkbox"
    :label="`Checkbox 1: ${checkbox.toString()}`"
    ></v-checkbox>
</div>
</template>

<script>
export default {
    data: function() { return {
        checkbox: false //실험용
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
</style>