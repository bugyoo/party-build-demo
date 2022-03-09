<template>
    <el-table
            style="width: 100%"
            row-key="id"
            border
            class="background-table"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            v-bind="$attrs"
            v-on="$listeners"
            >
        <slot></slot>
    </el-table>
</template>

<script>
    export default {
        registryName: 'tree-table'
    }
</script>
