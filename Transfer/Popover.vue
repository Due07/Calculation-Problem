<template>
    <el-popover
        popper-class="popover-component"
        placement="right-start"
        trigger="click"
        @hide="onHidePopover"
        :target-order="'original'"
    >
    <!-- target-order 排序策略 -->
        <el-transfer
            v-show="defaultTable"
            v-model="transferValue"
            :data="(tableAll || defaultTable) | transferFilter"
            :titles="['全部', '已选择']"
            :props="{
                key: 'value',
                label: 'name',
                disabled: 'disabled'
            }"
            :render-content="renderContent"
        >
        </el-transfer>
        <el-button slot="reference" icon="el-icon-s-tools" size="mini"></el-button>
    </el-popover>
</template>

<script lang="tsx">
import {
    Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { tableList } from '@/models/Base'; // 定义表头类型
import type { CreateElement } from 'vue';

@Component
export default class PopoverComponent extends Vue {
    // 全部表头
    @Prop() private tableAll: Array<tableList> | undefined

    // 默认表头
    @Prop() private defaultTable: Array<tableList> | undefined

    // 已设置的自定义表头
    @Prop() private customTable?: Array<string> | []

    transferValue: string[] = []

    renderContent(h: CreateElement, options: tableList) {
        const onBtn = (e: PointerEvent) => {
            e.preventDefault();
            e.stopPropagation();
            options.disabled = !options.disabled;
            // (e.target as EventTarget)
            (e.target as any).innerText = options.disabled ? '解冻' : '冻结';
            this.$forceUpdate(); // 解决elem的穿梭框radio不变问题
        };
        return (
            <el-tooltip
                content={options.name}
                placement='right'
                effect='dark'
            >

                <span class="flex justify-between">
                    <span class="truncate flex-1">
                        { options.name }
                    </span>

                    <span class="ml-3 mr-4" style="color: #409EFF;" onClick={onBtn}>
                        { options.disabled ? '解冻' : '冻结' }
                    </span>
                </span>
            </el-tooltip>
        );
    }

    @Watch('defaultTable', {immediate: true, deep: true})
    onTableListChange(nVal: Array<tableList>) {
        if (!this.customTable?.length) {
            this.transferValue = nVal.filter(item => item.value).map(item => item.value);
        }
    }

    @Watch('customTable', {immediate: true})
    onCustomValueChange(nVal: Array<string>) {
        if (nVal) this.transferValue = nVal;
    }

    onHidePopover() {
        const str = this.transferValue.join(',');
        // str 则当前选择表头
        // 把 str修改成 defaultTable数据类型 传递出去（session /发送请求存起来也可）

        // 根据用户的每个表传递个性化表头
        // *请求存储永久化表头 直接调用爷组件方法发送请求
        // this.$listeners()
    }
}
</script>
<style lang="scss">
.popover-component {
    .el-transfer__buttons {
        padding: 0 15px;
        .el-button {
            padding: 6px 12px;
        }
    }

    .el-checkbox {
        margin-right: 0;
    }
}

</style>
