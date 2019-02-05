<template>
    <div>
        <a-upload
            name="avatar"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :beforeUpload="beforeUpload"
            :customRequest="customRequest"
            @change="handleChange"
        >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">选择头像</div>
            </div>
        </a-upload>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { uploadImage } from '@/api/file';
import { updateAvatar } from '@/api/user';
import { successMessage } from '@/utils/message';


function getBase64(img: any, callback: any) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
@Component
export default class UserPageClass extends Vue {
    loading = false;
    imageUrl = '';
    handleChange(info: any) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world
      }
    }


    async customRequest(file: any) {
        const { data } = (await uploadImage(file.file)).data
        this.imageUrl = data
        this.loading = false
        await updateAvatar(this.imageUrl)
        this.$store.dispatch('SetAvatar', { avatar: this.imageUrl })
        successMessage('头像更新成功~')
    }
    beforeUpload(file: any) {
        console.log(file)
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
        if (!isJPG) {
            this.$message.error('You can only upload JPG file!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            this.$message.error('Image must smaller than 2MB!')
        }
        return isJPG && isLt2M
    }
}
</script>