<template>
    <div
        ref="imgDom"
        class="image-template"
    >
        <div class="load" v-if="!load">
            <template v-if="$slots.placeholder && !error">
                <slot name="placeholder"/>
            </template>
            <template v-else>
                <i
                    v-if="lazy && !lazySrc && !error"
                    class="icon-loading"
                />
            </template>
        </div>

        <transition name="image-fade" appear>
            <img
                v-if="!lazy ? src !== null : lazySrc !== null"
                class="image-view"
                :class="{[fit]: fit, 'cursor': previewSrcList.length}"
                draggable="false"
                :alt="alt"
                :src="!lazy ? src : lazySrc"
                :referrerPolicy="referrerPolicy"
                @load="onLoad"
                @error="onError"
                @click="onClick"
            />
        </transition>

        <template v-if="error">
            <template v-if="$slots.error">
                <slot name="error"/>
            </template>
            <template v-else>
                <span class="error">加载失败</span>
            </template>
        </template>
    </div>
</template>
<script lang="ts">
import {
    Component, Vue, Prop, Ref,
} from 'vue-property-decorator';
import ImagePreviewComponent from './ImagePreview.vue';

@Component({
    components: {
        ImagePreviewComponent,
    },
})
export default class ImageComponent extends Vue {
    @Ref() private readonly imgDom!: Vue & HTMLElement;

    @Prop({default: null}) src!: string | null;

    // 视图父级
    @Prop({default: undefined}) scrollContainer?: HTMLElement;

    // fill / contain / cover / none / scale-down
    @Prop({default: ''}) fit?: string;

    @Prop({default: ''}) alt?: string;

    // 原生 referrerPolicy
    @Prop({default: ''}) referrerPolicy?: string;

    // 是否懒加载
    @Prop({default: false, type: Boolean}) lazy!: boolean;

    // 图片预览 Array
    @Prop({default: () => [], type: Array}) previewSrcList!: string[];

    private lazySrc: string | null = null;

    private error = false;

    private load = false;

    mounted() {
        if (this.src !== null && this.lazy) {
            this.addObserver();
        }
        // this.appendBody();
    }

    appendBody() {
        const bodyChildren = [...document.body.children];
        // 已有实例 return
        if (bodyChildren.some(item => item.className.includes('image-preview'))) return;

        // 手动挂载完后 的组件实例
        const child = new ImagePreviewComponent({
            propsData: {
                list: this.previewSrcList,
            },
        }).$mount();
        // console.log(child);
        document.body.appendChild(child.$el);
    }

    addObserver() {
        const observer = new IntersectionObserver(
            (e: Partial<IntersectionObserverCallback>) => {
                // 正相交
                if (Array.isArray(e) && Reflect.has(e[0], 'isIntersecting')) {
                    if (e[0].isIntersecting) {
                        // console.log('窗口视图中~');
                        this.lazySrc = this.src;

                        observer.unobserve(this.imgDom);
                    }
                }
            },
            {
                root: this.scrollContainer,
                // 偏移量 上 右 下 左
                rootMargin: '0px 0px -16% 0px',
            },
        );
        observer.observe(this.imgDom);
        this.$once('hook:beforeDestroy', () => observer.unobserve(this.imgDom));
    }

    onClick() {
        if (this.previewSrcList.length) {
            this.appendBody();
            document.body.style.overflow = 'hidden';
        }
    }

    onLoad(e: Event) {
        this.load = true;
        this.$emit('load', e);
    }

    onError(e: Event) {
        // console.log(e);
        this.error = true;
        this.$emit('error', e);
    }
}
</script>
<style lang="scss" scoped>
::v-deep.image-template {
    position: relative;
    .placeholder {
        position: absolute;
    }
    .image-view {
        opacity: 1;

        &.cursor {
            cursor: pointer;
        }
        &.fill {
            object-fit: fill;
        }
        &.contain {
            object-fit: contain;
        }
        &.cover {
            object-fit: cover;
        }
        &.none {
            object-fit: none;
        }
        &.scale-down {
            object-fit: scale-down;
        }
    }
    // loading显示
    .icon-loading {
        display: inline-block;
        width: 6ch;
        overflow: hidden;
        white-space: nowrap;
        animation: rotating 4s steps(6) infinite;
        &::before {
            font-family: "Cascadia Code", Menlo, Monaco, "Courier New", monospace;
            content: ".....";
        }
    }
    // 失败
    .error {
        color: rgba($color: #7c7c7c, $alpha: 1.0);
    }
    @keyframes rotating {
        0% {
            width: 0;
        }
    }

    .image-fade-enter,
    .image-fade-leave-active {
        opacity: 0;
    }
    .image-fade-enter-active,
    .image-fade-leave-active {
        transition: opacity 1.2s;
    }
}
</style>
