<template>
    <transition name="preview-fade" appear>
        <div
            ref="imagePreview"
            class="image-preview"
        >
            <div class="close" @click="onClose"></div>
            <div class="image-content">
                <template v-for="(item, key) in list">
                    <img
                        v-show="selectIndex%list.length === key"
                        :key="key"
                        draggable="false"
                        :style="selectIndex%list.length === key ? imgStyle : ''"
                        :src="item"
                    />
                </template>
            </div>
            <div class="select-btn" v-if="list.length > 1">
                <i class="left" @click="nextBtn(false)">
                    <img src="./img/left.svg"/>
                </i>
                <i class="right" @click="nextBtn(true)">
                    <img src="./img/right.svg"/>
                </i>
            </div>
            <div class="option-btn"  v-if="list.length">
                <div class="option-action">
                    <!-- 缩小 / 放大 / 左转 / 右转 -->
                    <i class="icon-narrow" @click="onZoomBtn('narrow')">
                        <img src="./img/narrow.svg" />
                    </i>
                    <i class="icon-enlarge" @click="onZoomBtn('Enlarge')">
                        <img src="./img/enlarge.svg" />
                    </i>
                    <i class="icon-turn-left" @click="onRotateBtn('left')">
                        <img src="./img/turn-left.svg" />
                    </i>
                    <i class="icon-turn-right" @click="onRotateBtn('right')">
                        <img src="./img/turn-right.svg" />
                    </i>
                </div>
            </div>
        </div>
    </transition>
</template>
<script lang="ts">
import {
    Component, Prop, Ref, Vue, Watch,
} from 'vue-property-decorator';

type TImgStyle = {
    transform: string;
    transition: 'transform 0.3s ease 0s';
}

@Component
export default class ImagePreviewComponent extends Vue {
    @Ref() imagePreview!: Vue & HTMLElement

    @Prop({default: () => [], type: Array}) list!: string[];

    @Watch('list', {deep: true, immediate: true})
    onListChange(nVal: string[]) {
        console.log(nVal);
    }

    private selectIndex = 0

    private imgStyle: TImgStyle = {
        transform: 'scale(1) rotate(0deg)',
        transition: 'transform 0.3s ease 0s',
    }

    onClose() {
        console.log(this.$el);
        this.$el.remove();
        document.body.style.overflow = '';
    }

    nextBtn(type: boolean) {
        // console.log(type);
        if (!type && this.selectIndex === 0) return;

        this.imgStyle = {
            transform: 'scale(1) rotate(0deg)',
            transition: 'transform 0.3s ease 0s',
        };
        return !type ? --this.selectIndex : ++this.selectIndex;
    }

    onZoomBtn(val: string) {
        console.log(val, this.imgStyle.transform);

        const test = /scale\(+(\S*)+\)/;
        if (test.test(this.imgStyle.transform)) {
            if (+RegExp.$1 === 0.2 && val === 'narrow') return;
            console.log('$1: ', RegExp.$1);

            this.imgStyle.transform = this.imgStyle.transform.replace(
                test,
                `scale(${(+(RegExp.$1) + (val === 'narrow' ? -0.2 : 0.2)).toFixed(1)})`,
            );
        } else {
            this.imgStyle.transform = 'scale(1) rotate(0deg)';
            this.onZoomBtn(val);
        }
        console.log(this.imgStyle.transform);
    }

    onRotateBtn(val: string) {
        console.log(val);

        const test = /rotate\(+(\S*)+deg\)/;
        if (test.test(this.imgStyle.transform)) {
            console.log('$1: ', RegExp.$1);

            this.imgStyle.transform = this.imgStyle.transform.replace(
                test,
                `rotate(${+(RegExp.$1) + (val === 'left' ? -90 : 90)}deg)`,
            );
        } else {
            this.imgStyle.transform = 'scale(1) rotate(0deg)';
            this.onRotateBtn(val);
        }

        console.log(this.imgStyle.transform);
    }
}
</script>
<style lang="scss" scoped>
.preview-fade-enter,
.preview-fade-leave-active {
    opacity: 0;
}
.preview-fade-enter-active,
.preview-fade-leave-active {
    transition: opacity .5s;
}
::v-deep.image-preview {
    position: fixed;
    z-index: 10;
    top: 0;
    background-color: rgba($color: #000000, $alpha: .5);
    width: 100%;
    height: 100%;

    @mixin action-color {
        background-color: #606266;
        color: #FFFFFF;
        font-size: 20px;
        cursor: pointer;
    }

    @mixin hover-scale($size: 1.06) {
        &:hover {
            transform: scale($size);
        }
    }

    .close {
        @include action-color();
        @include hover-scale();
        position: absolute;
        right: 40px;
        top: 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;

        &::before, &::after {
            content: '|';
            position: absolute;
            transform-origin: 50% 53%;
            top: 48%;
        }

        &::before {
            left: 50%;
            transform: translate(-50%, -50%) rotateZ(45deg);
        }

        &::after {
            right: 50%;
            transform: translate(50%, -50%) rotateZ(-45deg);
        }
    }

    .image-content {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .select-btn {
        width: inherit;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        i {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            @include action-color();
            @include hover-scale();

            &.left {
                left: 30px;
            }
            &.right {
                right: 30px;
            }

            img {
                width: 15px;
            }
        }
    }

    .option-btn {
        @include action-color();
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 260px;
        height: 40px;
        border-radius: 40px;

        .option-action {
            display: flex;
            align-items: center;
            justify-content: space-evenly;

            i {
                width: 40px;

                @include hover-scale(1.1);
            }
        }
    }
}
</style>
