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
        <v-btn :class="'eleavtion-15'">이건 버튼이다 버튼</v-btn>
        <br>
        <v-checkbox
        v-model="checkbox"
        :label="'이건 체크박스다 체크박스'"
        ></v-checkbox>
        <br>
        <v-card class='sideBig'
          elevation="24"
        >
          elevation
        </v-card>
        
        <v-footer
        v-bind="localAttrs"
        padless
        >
            <v-card
            flat
            tile
            width="100%"
            class="red lighten-1 text-center">
                <v-card-text>
                <v-btn
                v-for="icon in icons"
                :key="icon"
                class="mx-4"
                icon>
                    <v-icon size="24px">
                    {{ icon }}
                    </v-icon>
                </v-btn>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-text class="white--text">
                {{ new Date().getFullYear() }} — <strong>예쁜 제미넴</strong>
                </v-card-text>
            </v-card>
        </v-footer>
        
    </div>
</template>

<script>
export default {
    data: function() { return {
        checkbox: true, //실험용
        localAttrs: {
            absolute: false,
            fixed: true,
        }, //실험용
        icons: [
            'mdi-home',
            'mdi-email',
            'mdi-calendar',
            'mdi-delete',
        ], //실험용
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
.toTop {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
}
.sideBig{
    width: 100%;
    padding: 20px;
    margin: 12px;
}
</style>