<template>
    <el-form v-bind="$attrs" v-on="$listeners" ref="searchMoreFormRef" class="list-layout-search-more-wrap" @submit.native.prevent size="mini" inline>
        <slot></slot>
    </el-form>
</template>

<script>
    export default {
        name: 'SearchMore',

        registryName: 'SearchMore',

        methods: {
            resetFields (){
                let searchMoreFormInstance = this.$getRef('searchMoreFormRef');

                searchMoreFormInstance && searchMoreFormInstance.resetFields && searchMoreFormInstance.resetFields();
            }
        }
    }
</script>

<style lang="scss">
    .list-layout-search-more-wrap {
        width: calc(100% - 20px);
        height: 100%;
        min-height: 40px;
        padding: 10px 10px 0;
    }
</style>
