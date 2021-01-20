<template>
    <div class='root'>
        <img alt="Vue logo" src="./assets/logo.png" />
        <hello-world msg="Welcome to Your Vue.js App" />
        <br><br>
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
        <br>
        <v-btn elevation="15">이건 버튼이다 버튼</v-btn>
        <br>
        <v-checkbox
        v-model="checkbox"
        :label="'이건 체크박스다 체크박스'"
        ></v-checkbox>

        <v-bottom-navigation shift v-model="value" class='toBottom'>
            <v-btn value="recent">
            <span>Recent</span>

            <v-icon>mdi-history</v-icon>
            </v-btn>

            <v-btn value="favorites">
            <span>Favorites</span>

            <v-icon>mdi-heart</v-icon>
            </v-btn>

            <v-btn value="nearby">
            <span>Nearby</span>

            <v-icon>mdi-map-marker</v-icon>
            </v-btn>
        </v-bottom-navigation>
        
    </div>
</template>

<script>
export default {
    data: function() { return {
        checkbox: true, //실험용
        value: 'recent', //실험용
    }},
    computed: {
    },
    methods:{
    },
    watch: {
    },
    mounted: function(){
    }
};
</script>

<style>
.root {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.toBottom {
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
}
</style>