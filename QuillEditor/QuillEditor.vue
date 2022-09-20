<template>
    <div class="relative">
        <quill-editor
            ref="quill"
            v-model="content"
            :options="options"
            :disabled="disabled"

            @blur="onEditorBlur($event)"
            @change="onEditorChange($event)"
            @focus="onEditorFocus($event)">
        </quill-editor>

        <input
            class="absolute quill-upload-img"
            type="file"
            ref="upload"
            :disabled="input.disabled"
            accept="image/*"
            @change="inputChangeImg">

        <div v-show="isShow" class="absolute show-cropper-container">
            <img ref="image">
            <div class="absolute show-cropper-btn">
                <el-button
                    @click="cancel"
                    type="default"
                    style="margin-top: 10px">
                    取消
                </el-button>
                <el-button
                    @click="submit"
                    type="primary"
                    style="margin-top: 10px">
                    完成
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Cropper from 'cropperjs';
import FileUpload from '@/scripts/widget/FileUpload';
import 'cropperjs/dist/cropper.min.css';

export default {
    name: 'quill-editor-wrapper',
    props: {
        value: {
            type: String,
            default() {
                return '';
            },
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            content: this.value,
            options: {
                debug: 'info',
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
                            ['blockquote', 'code-block'], // 引用，代码块

                            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
                            [{ list: 'ordered'}, { list: 'bullet' }], // 列表
                            [{ script: 'sub'}, { script: 'super' }], // 上下标
                            [{ indent: '-1'}, { indent: '+1' }], // 缩进
                            [{ direction: 'rtl' }], // 文本方向

                            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
                            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题

                            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                            [{ font: [] }], // 字体
                            [{ align: [] }], // 对齐方式

                            ['image', 'video'], // 上传图片、上传视频,

                            ['clean'], // 清除字体样式
                        ],
                        handlers: {
                            image: (val) => {
                                if (val) this.$refs.upload.click();
                            },
                        },
                    },
                    // 黏贴图片base64问题
                    clipboard: {
                        matchers: [
                            ['img', this.noPastingPictures],
                        ],
                    },
                },
                placeholder: '请在此输入您的内容',
                readOnly: false,
                theme: 'snow', // bubble-只有文本域
            },

            isShow: false,
            cropper: null,
            input: {
                accept: this.accept || '.jpg,.png,.jpeg',
                disabled: this.disabled || false,
                multiple: this.multiple || false,

            },
        };
    },
    watch: {
        value() {
            this.content = this.value;
        },
    },
    methods: {
        // 接收quill https://quilljs.com/docs/api/
        onEditorBlur() {
            this.$emit('handleContent', this.content);
        },
        onEditorFocus() {
            this.$emit('handleContent', this.content);
        },
        onEditorChange() {
            this.noPastingPictures();
            this.$emit('handleContent', this.content);
        },
        async inputChangeImg(event) {
            const files = event.target.files;

            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            // 文件读取成功
            reader.onload = (e) => {
                this.isShow = true;
                const image = this.$refs.image;
                image.src = e.target.result;
                this.$nextTick(() => {
                    this.initCropper(image);
                });
            };
        },
        // 初始化裁剪
        initCropper(ele) {
            this.input.disabled = true;
            this.cropper = new Cropper(ele, {
                aspectRatio: this.ratio || NaN,
            });
        },
        /**
         * dataURL to blob
         * @param dataURI
         * @returns {Blob}
         */
        dataURItoBlob(dataURI) {
            const byteString = atob(dataURI.split(',')[1]);
            const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], {type: mimeString});
        },
        // 提交
        submit(event) {
            event.stopPropagation();
            if (!this.cropper) return;
            const croppedCanvas = this.cropper.getCroppedCanvas();
            const image = this.$refs.image;
            const src = croppedCanvas.toDataURL('image/png');
            image.src = src;
            const file = this.dataURItoBlob(src);
            file.name = new Date().getTime();
            if (this.input.disabledImgHandle) this.options = null;
            this.upload(file);
            // 上传完成后,销毁cropper
            this.isShow = false;
            this.input.disabled = false;
            this.cropper.destroy();
        },
        cancel(event) {
            event.stopPropagation();
            this.isShow = false;
            this.input.disabled = false;
            if (!this.cropper) return;
            this.cropper.destroy();
        },
        // 上传
        upload: async function (file) {
            // 上传文件 无贴code
            const files = await (new FileUpload())
                .uploadStart([file]);

            // 添加到编辑器
            const quill = this.$refs.quill.quill;
            const length = quill.getSelection().index; // 获取光标所在位置
            quill.insertEmbed(length, 'image', files[0].url); // 插入图片 res.url为服务器返回的图片地址
            quill.setSelection(length + 1); // 光标位置修改
        },
        // 黏贴图片base64改为上传url
        noPastingPictures(node, delta) {
            if (delta && delta.ops) {
                delta.ops.forEach(item => {
                    if (
                        item.insert
                        && item.insert.image
                        && item.insert.image.includes('data:image')
                    ) {
                        const { image } = item.insert;
                        const file = this.dataURItoBlob(image);
                        file.name = new Date().getTime();
                        this.upload(file);
                    }
                });
            }

            return delta;
        },
    },
};
</script>

<style lang="scss">
.quill-editor {
    .ql-toolbar {
        line-height: 1;
    }
    .ql-editor {
        img {
            display: inline-block;
            max-height: initial;
        }
    }
}
</style>
