<template>
    <div class="app-wrapper">
        <Sidebar></Sidebar>
        <div class="main-container">
            <Navbar></Navbar>
            <AppMain></AppMain>
        </div>
    </div>
</template>

<script lang="ts">
import Sidebar from './components/sidebar.vue'
import Navbar from './components/navbar.vue'
import AppMain from './components/appmain.vue'
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
    components: {
        Sidebar,
        Navbar,
        AppMain
    }
})
export default class LayoutClass extends Vue {

}

</script>

<style lang="less">
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.main-container {
  min-height: 100vh;
  transition: margin-left 0.28s;
  margin-left: 256px;
  background-color: #f0f2f5;
}

</style>